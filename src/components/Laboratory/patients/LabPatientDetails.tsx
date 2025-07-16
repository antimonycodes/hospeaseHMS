import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import Loader from "../../../Shared/Loader";
import { ChevronLeft, TestTube, Upload, Plus, FileText } from "lucide-react";
import LabMedicalTimeline from "./LabMedicalTimeline";
import TestSelectionPanel from "./TestSelectionPanel";
import TestParametersPanel from "./TestParametersPanel";
import ReportPreviewModal from "./ReportPreviewModal";
import { labTests } from "./labTestData";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const LabPatientDetails = () => {
  const [departmentId, setDepartmentId] = useState<any>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isUpdatingReport, setIsUpdatingReport] = useState(false);
  const [existingReportFile, setExistingReportFile] = useState<string | null>(
    null
  );

  const { patientId, caseId } = useParams();
  const { getLabPatientById } = usePatientStore();
  const {
    isReportLoading,
    isResponding,
    getSingleReport,
    singleReport,
    respondToReport,
    deptCreateReport,
  } = useReportStore();
  const selectedPatient = usePatientStore((state) => state.selectedPatient);
  const isLoading = usePatientStore((state) => state.isLoading);

  const [selectedTests, setSelectedTests] = useState<{
    [category: string]: string[];
  }>({});
  const [testResults, setTestResults] = useState<{
    [testName: string]: { [param: string]: string | number };
  }>({});
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [reportMode, setReportMode] = useState<"create" | "upload">("create");
  const defaultHospitalName = localStorage.getItem("hospitalName");

  const navigate = useNavigate();

  useEffect(() => {
    const userInfoString = localStorage.getItem("user-info");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        const id = userInfo?.attributes?.department?.id ?? null;
        setDepartmentId(id);
      } catch (error) {
        console.error("Error parsing user-info from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (patientId) {
      getLabPatientById(patientId);
      getSingleReport(patientId);
    }
  }, [patientId, getLabPatientById, getSingleReport, caseId]);

  console.log(singleReport);

  // Check if there's an existing report file to determine if we're updating
  useEffect(() => {
    if (singleReport) {
      const reports = singleReport;
      const labReport = reports.find(
        (report: any) =>
          report.attributes.department.name === "Laboratory" &&
          report.attributes.role === "laboratory" &&
          report.attributes.file
      );

      if (labReport?.attributes?.file) {
        setExistingReportFile(labReport.attributes.file);
        setIsUpdatingReport(true);
      } else {
        setExistingReportFile(null);
        setIsUpdatingReport(false);
      }
    }
  }, [singleReport]);

  const patient = selectedPatient?.attributes;

  const handleTestSelect = (category: string, testName: string) => {
    setSelectedTests((prev) => {
      const newSelectedTests = { ...prev };
      if (!newSelectedTests[category]) {
        newSelectedTests[category] = [];
      }

      if (newSelectedTests[category].includes(testName)) {
        // Remove test if already selected
        newSelectedTests[category] = newSelectedTests[category].filter(
          (t) => t !== testName
        );
        if (newSelectedTests[category].length === 0) {
          delete newSelectedTests[category];
        }
      } else {
        // Add test if not selected
        newSelectedTests[category].push(testName);
      }

      return newSelectedTests;
    });

    // Initialize empty results for new test
    if (!testResults[testName]) {
      const initialResults: { [param: string]: string | number } = {};
      labTests[category].tests[testName].parameters.forEach((param) => {
        initialResults[param.name] = "";
      });
      setTestResults((prev) => ({
        ...prev,
        [testName]: initialResults,
      }));
    }
  };

  const handleParameterChange = (
    testName: string,
    paramName: string,
    value: string
  ) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        [paramName]: value,
      },
    }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const generatePatientReportHeader = () => {
    const currentDate = new Date();
    return {
      hospitalName: defaultHospitalName || "",
      reportTitle: isUpdatingReport
        ? "UPDATED LABORATORY REPORT"
        : "LABORATORY REPORT",
      patientInfo: {
        name: `${patient?.first_name || ""} ${patient?.last_name || ""}`.trim(),
        patientId: patient?.card_id || "",
        age: patient?.age || "",
        gender: patient?.gender || "",
        phone: patient?.phone_number || "",
        address: patient?.address || "",
      },
      reportInfo: {
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
      },
    };
  };

  const hasFilledTestResults = () => {
    return Object.entries(selectedTests).some(([category, tests]) => {
      return tests.some((testName) => {
        const testData = labTests[category].tests[testName];
        const results = testResults[testName] || {};
        return testData.parameters.some((param) => {
          const value = results[param.name];
          return value && value.toString().trim() !== "";
        });
      });
    });
  };

  const generatePDFBlob = async (): Promise<Blob> => {
    const doc = new jsPDF();
    doc.setLineHeightFactor(1);
    const header = generatePatientReportHeader();
    let yPosition = 20;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(header.hospitalName, 105, yPosition, { align: "center" });
    yPosition += 8;

    doc.setFontSize(12);
    doc.text(header.reportTitle, 105, yPosition, { align: "center" });
    yPosition += 10;

    doc.setLineWidth(0.3);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;

    const column1X = 20;
    const column2X = 105;
    let column1Y = yPosition;
    let column2Y = yPosition;

    // PATIENT INFO
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION:", column1X, column1Y);
    column1Y += 5;
    doc.setFont("helvetica", "normal");

    const patientInfo = [
      `Name: ${header.patientInfo.name}`,
      `Patient ID: ${header.patientInfo.patientId}`,
      `Age: ${header.patientInfo.age}`,
      `Gender: ${header.patientInfo.gender}`,
      `Phone: ${header.patientInfo.phone}`,
      `Address: ${header.patientInfo.address}`,
    ];

    patientInfo.forEach((line) => {
      doc.text(line, column1X, column1Y);
      column1Y += 4;
    });

    // REPORT INFO
    doc.setFont("helvetica", "bold");
    doc.text("REPORT INFORMATION:", column2X, column2Y);
    column2Y += 5;
    doc.setFont("helvetica", "normal");

    const reportInfo = [
      `Date: ${header.reportInfo.date}`,
      `Time: ${header.reportInfo.time}`,
      `Status: ${status}`,
      ...(isUpdatingReport ? [`Update Type: Additional Tests`] : []),
    ];

    reportInfo.forEach((line) => {
      doc.text(line, column2X, column2Y);
      column2Y += 4;
    });

    yPosition = Math.max(column1Y, column2Y) + 10;

    const categoriesWithData: Array<{ category: string; tests: string[] }> = [];

    Object.entries(selectedTests).forEach(([category, tests]) => {
      const filledTests = tests.filter((testName) => {
        const testData = labTests[category]?.tests[testName];
        const results = testResults[testName] || {};
        return testData?.parameters.some((param) => {
          const val = results[param.name];
          return val && val.toString().trim() !== "";
        });
      });

      if (filledTests.length > 0) {
        categoriesWithData.push({ category, tests: filledTests });
      }
    });

    const leftX = 20;
    const rightX = 105;
    const pageHeight = 280;
    let leftY = yPosition;
    let rightY = yPosition;

    const calculateHeight = (category: string, tests: string[]) => {
      let height = 5;
      tests.forEach((testName) => {
        const testData = labTests[category]?.tests[testName];
        const results = testResults[testName] || {};
        height += 4;
        testData?.parameters.forEach((param) => {
          const val = results[param.name];
          if (val && val.toString().trim() !== "") {
            height += param.normalRange ? 6 : 4;
          }
        });
        height += 2;
      });
      return height;
    };

    const renderCategory = (
      category: string,
      tests: string[],
      x: number,
      y: number
    ): number => {
      let currentY = y;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(category.toUpperCase(), x, currentY);
      currentY += 5;

      tests.forEach((testName) => {
        const testData = labTests[category]?.tests[testName];
        const results = testResults[testName] || {};

        const filledParams = testData?.parameters.filter((param) => {
          const val = results[param.name];
          return val && val.toString().trim() !== "";
        });

        if (filledParams?.length) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.text(`• ${testName}`, x + 2, currentY);
          currentY += 4;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);

          filledParams.forEach((param) => {
            const val = results[param.name];
            doc.text(
              `${param.name}: ${val} ${param.unit || ""}`,
              x + 5,
              currentY
            );
            currentY += 4;

            if (param.normalRange) {
              doc.setTextColor(100, 100, 100);
              doc.text(`Range: ${param.normalRange}`, x + 8, currentY);
              doc.setTextColor(0, 0, 0);
              currentY += 2;
            }
          });

          currentY += 2;
        }
      });

      return currentY;
    };

    categoriesWithData.forEach(({ category, tests }) => {
      const height = calculateHeight(category, tests);

      let useLeft = true;
      if (leftY + height > pageHeight && rightY + height <= pageHeight) {
        useLeft = false;
      } else if (leftY + height > pageHeight && rightY + height > pageHeight) {
        doc.addPage();
        leftY = 20;
        rightY = 20;
        useLeft = true;
      } else if (rightY < leftY) {
        useLeft = false;
      }

      if (useLeft) {
        leftY = renderCategory(category, tests, leftX, leftY) + 5;
      } else {
        rightY = renderCategory(category, tests, rightX, rightY) + 5;
      }
    });

    let finalY = Math.max(leftY, rightY);
    if (finalY + 15 > pageHeight) {
      doc.addPage();
      finalY = 20;
    }

    doc.setLineWidth(0.3);
    doc.line(20, finalY, 190, finalY);
    finalY += 6;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(`Report ID: HMS-${Date.now()}`, 20, finalY);

    return doc.output("blob");
  };

  const handleReportSubmit = async () => {
    if (isUpdatingReport) {
      // Show completion modal for updates
      // setShowCompletionModal(true);
      await submitReport(true);
    } else {
      // Handle new report submission
      await submitReport(false);
    }
  };

  const submitReport = async (markAsCompleted: boolean = false) => {
    try {
      const formData: {
        note: string;
        status: string | null;
        file?: File | null;
        testResults: {};
        patientHeader: any;
        patient_id: string | number | null;
        role?: any;
        department_id: number | null;
      } = {
        note:
          reportMode === "upload"
            ? isUpdatingReport
              ? "Updated Lab Report"
              : "Lab Report"
            : isUpdatingReport
            ? "Updated Comprehensive Laboratory Report"
            : "Comprehensive Laboratory Report",
        status: "completed" as string,
        testResults: {},
        patientHeader: generatePatientReportHeader(),
        patient_id: null,
        department_id: null,
      };

      if (reportMode === "upload") {
        if (!file) {
          toast.error("Please select a file to upload");
          return;
        }
        formData.file = file;
      } else {
        if (!hasFilledTestResults()) {
          toast.error(
            "Please fill in at least one test parameter before submitting"
          );
          return;
        }

        const pdfBlob = await generatePDFBlob();
        const pdfFile = new File([pdfBlob], `Lab_Report_${Date.now()}.pdf`, {
          type: "application/pdf",
        });

        const structuredResults: { [category: string]: any } = {};
        Object.entries(selectedTests).forEach(([category, tests]) => {
          structuredResults[category] = {};
          tests.forEach((testName) => {
            const testData = labTests[category].tests[testName];
            const results = testResults[testName] || {};

            const hasFilledParams = testData.parameters.some((param) => {
              const value = results[param.name];
              return value && value.toString().trim() !== "";
            });

            if (hasFilledParams) {
              structuredResults[category][testName] = testResults[testName];
            }
          });
        });

        formData.testResults = structuredResults;
        formData.file = pdfFile;
      }

      let success = false;
      if (isUpdatingReport) {
        // Use deptCreateReport for updates
        formData.patient_id = patientId ?? null;
        formData.role = "laboratory";
        formData.department_id =
          departmentId !== undefined ? departmentId : null;

        success = await deptCreateReport(formData);
        success = await deptCreateReport(formData);

        // If marking as completed, also update the original report status
        // if (markAsCompleted && success) {
        //   await respondToReport(caseId, {
        //     note: "Lab tests completed",
        //     status: "completed",
        //   });
        // }
      } else {
        // Use respondToReport for new reports
        // Only pass the fields expected by respondToReport
        const { note, status, file } = formData;
        success = await respondToReport(caseId, {
          note,
          status: status ?? "completed",
          file,
        });
      }

      if (success) {
        await getSingleReport(patientId);
        setSelectedTests({});
        setTestResults({});
        setStatus("In Progress");
        setFile(null);
        setReportMode("create");
        setShowCompletionModal(false);

        const message = isUpdatingReport
          ? markAsCompleted
            ? "Lab report updated and case completed!"
            : "Lab report updated successfully!"
          : "Lab report submitted successfully!";

        toast.success(message);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report. Please try again.");
    }
  };

  const generateReportContent = (): string => {
    const header = generatePatientReportHeader();
    let reportText = `
${header.hospitalName}
${"=".repeat(50)}

${header.reportTitle}

PATIENT INFORMATION:
--------------------
Name: ${header.patientInfo.name}
Patient ID: ${header.patientInfo.patientId}
Age: ${header.patientInfo.age}
Gender: ${header.patientInfo.gender}
Phone: ${header.patientInfo.phone}
Address: ${header.patientInfo.address}

REPORT INFORMATION:
------------------
Date: ${header.reportInfo.date}
Time: ${header.reportInfo.time}
Status: ${status}
${isUpdatingReport ? `Update Type: Additional Tests\n` : ""}

${"=".repeat(50)}
`;

    Object.entries(selectedTests).forEach(([category, tests]) => {
      const testsWithData = tests.filter((testName) => {
        const testData = labTests[category].tests[testName];
        const results = testResults[testName] || {};
        return testData.parameters.some((param) => {
          const value = results[param.name];
          return value && value.toString().trim() !== "";
        });
      });

      if (testsWithData.length > 0) {
        reportText += `\n${category.toUpperCase()}:\n${"-".repeat(
          category.length
        )}\n`;

        testsWithData.forEach((testName) => {
          const testData = labTests[category].tests[testName];
          const results = testResults[testName] || {};

          const filledParameters = testData.parameters.filter((param) => {
            const value = results[param.name];
            return value && value.toString().trim() !== "";
          });

          if (filledParameters.length > 0) {
            reportText += `\nTest: ${testName}\n`;

            filledParameters.forEach((param) => {
              const value = results[param.name];
              reportText += `${param.name}: ${value} ${param.unit || ""}\n`;
              if (param.normalRange) {
                reportText += `  Normal Range: ${param.normalRange}\n`;
              }
            });

            reportText += "\n";
          }
        });
      }
    });

    reportText += `\n${"=".repeat(50)}\n`;
    reportText += `Report ID: HMS-${Date.now()}\n`;

    return reportText;
  };

  const countSelectedTests = () => {
    return Object.values(selectedTests).reduce(
      (total, tests) => total + tests.length,
      0
    );
  };

  if (isReportLoading || isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg custom-shadow mb-6 p-6">
      {/* Back navigation */}
      <div className="flex items-center mb-6">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} />
          <span className="font-medium">Back to Patients</span>
        </button>
      </div>

      {/* Patient Basic Info Card */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["First Name", patient?.first_name],
            ["Last Name", patient?.last_name],
            ["Patient ID", patient?.card_id],
            ["Age", patient?.age],
            ["Gender", patient?.gender],
            ["Region", patient?.region],
            ["Occupation", patient?.occupation],
            ["Religion", patient?.religion],
            ["Phone", patient?.phone_number],
          ].map(([label, value], idx) => (
            <div key={idx}>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="font-medium">{value || ""}</p>
            </div>
          ))}
          <div className="col-span-3">
            <p className="text-gray-500 text-sm">House Address</p>
            <p className="font-medium">{patient?.address || ""}</p>
          </div>
        </div>
      </div>

      {/* Lab Medical Timeline */}
      {patient && patientId && (
        <div className="mb-6">
          <LabMedicalTimeline
            patientId={patientId}
            patient={patient}
            showDownloadCompleteButton={true}
          />
        </div>
      )}

      {/* Status Banner */}
      {isUpdatingReport && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="font-medium text-blue-800">
                Updating Existing Report
              </p>
              <p className="text-sm text-blue-600">
                You are adding new test results to an existing lab report.
                <a
                  href={existingReportFile || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1 hover:text-blue-800"
                >
                  View current report
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Mode Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setReportMode("create")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reportMode === "create"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <TestTube className="inline-block w-4 h-4 mr-2" />
            {isUpdatingReport ? "Add New Tests" : "Create Lab Report"}
          </button>
          <button
            onClick={() => setReportMode("upload")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reportMode === "upload"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Upload className="inline-block w-4 h-4 mr-2" />
            {isUpdatingReport
              ? "Upload Additional Report"
              : "Upload External Report"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Test Selection Panel - Only show in create mode */}
        {reportMode === "create" && (
          <TestSelectionPanel
            labTests={labTests}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            selectedTests={selectedTests}
            handleTestSelect={handleTestSelect}
          />
        )}

        {/* Main Content Area */}
        <div
          className={
            reportMode === "create" ? "xl:col-span-3" : "xl:col-span-4"
          }
        >
          {reportMode === "create" ? (
            <>
              {countSelectedTests() > 0 && (
                <TestParametersPanel
                  labTests={labTests}
                  selectedTests={selectedTests}
                  testResults={testResults}
                  handleParameterChange={handleParameterChange}
                  setShowPreview={setShowPreview}
                  status={status}
                  setStatus={setStatus}
                  file={file}
                  setFile={setFile}
                  isResponding={isResponding}
                  handleReportSubmit={handleReportSubmit}
                  generateReportContent={generateReportContent}
                  generatePDFBlob={generatePDFBlob}
                  // isUpdatingReport={isUpdatingReport}
                />
              )}

              {countSelectedTests() === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="text-gray-500 mb-4">
                    <TestTube className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isUpdatingReport
                      ? "No Additional Tests Selected"
                      : "No Tests Selected"}
                  </h3>
                  <p className="text-gray-600">
                    {isUpdatingReport
                      ? "Select additional tests from the panel on the left to add to the existing report."
                      : "Select tests from the panel on the left to begin creating a lab report."}
                  </p>
                </div>
              )}
            </>
          ) : (
            // Upload Report Mode
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="text-gray-500 mb-4">
                  <Upload className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isUpdatingReport
                    ? "Upload Additional Lab Report"
                    : "Upload External Lab Report"}
                </h3>
                <p className="text-gray-600">
                  {isUpdatingReport
                    ? "Upload an additional lab report file to supplement the existing report."
                    : "Upload a lab report file (PDF, DOC, DOCX, JPG, PNG) for this patient."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Report File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {file && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {!isUpdatingReport && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {/* <option value="In Progress">In Progress</option> */}
                      <option value="Completed">Completed</option>
                      {/* <option value="Pending">Pending</option> */}
                    </select>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleReportSubmit}
                    disabled={!file || isResponding}
                    className="px-6 py-2 bg-primary text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResponding
                      ? "Processing..."
                      : isUpdatingReport
                      ? "Add to Report"
                      : "Upload Report"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-[#1E1E1E40]   flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Complete Lab Tests?
            </h3>
            <p className="text-gray-600 mb-6">
              Are all laboratory tests for this patient now completed? Selecting
              "Yes" will mark the entire case as completed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => submitReport(false)}
                className="px-4 py-2 bg-gray-300 text-white rounded-lg  transition-colors"
              >
                No, Still in progress
              </button>
              <button
                onClick={() => submitReport(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg transition-colors"
              >
                Yes, Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      <ReportPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        reportContent={generateReportContent()}
      />
    </div>
  );
};

export default LabPatientDetails;
