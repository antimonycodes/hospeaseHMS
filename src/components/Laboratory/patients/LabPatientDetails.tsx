// LabPatientDetails.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import Loader from "../../../Shared/Loader";
import { ChevronLeft, TestTube } from "lucide-react";
import LabMedicalTimeline from "./LabMedicalTimeline";
import TestSelectionPanel from "./TestSelectionPanel";
import TestParametersPanel from "./TestParametersPanel";
import ReportPreviewModal from "./ReportPreviewModal";
import { labTests } from "./labTestData";

const LabPatientDetails = () => {
  const { patientId, caseId } = useParams();
  const { getLabPatientById } = usePatientStore();
  const {
    isReportLoading,
    isResponding,
    getSingleReport,
    singleReport,
    respondToReport,
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
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      getLabPatientById(patientId);
      getSingleReport(patientId);
    }
  }, [patientId, getLabPatientById, getSingleReport, caseId]);

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
      hospitalName: "Hospital Management System",
      reportTitle: "COMPREHENSIVE LABORATORY REPORT",
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

  const handleReportSubmit = async () => {
    try {
      // Define the formData type properly
      const formData: {
        note: string;
        status: string;
        file?: File;
        testResults: {};
        patientHeader: any;
      } = {
        note: "Comprehensive Laboratory Report",
        status,
        testResults: {},
        patientHeader: generatePatientReportHeader(),
      };

      // Structure test results by category
      const structuredResults: { [category: string]: any } = {};
      Object.entries(selectedTests).forEach(([category, tests]) => {
        structuredResults[category] = {};
        tests.forEach((testName) => {
          structuredResults[category][testName] = testResults[testName];
        });
      });

      formData.testResults = structuredResults;

      // Only add file if one is provided
      if (file) {
        formData.file = file;
      }

      const success = await respondToReport(caseId, formData);
      if (success) {
        await getSingleReport(patientId);
        setSelectedTests({});
        setTestResults({});
        setStatus("In Progress");
        setFile(null);
        alert("Lab report submitted successfully!");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
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

${"=".repeat(50)}
`;

    // Add test results for each category
    Object.entries(selectedTests).forEach(([category, tests]) => {
      reportText += `\n${category.toUpperCase()}:\n${"-".repeat(
        category.length
      )}\n`;

      tests.forEach((testName) => {
        reportText += `\nTest: ${testName}\n`;
        const testData = labTests[category].tests[testName];
        const results = testResults[testName] || {};

        testData.parameters.forEach((param) => {
          const value = results[param.name] || "Not Provided";
          reportText += `${param.name}: ${value} ${param.unit || ""}\n`;
          reportText += `  Normal Range: ${param.normalRange}\n`;
        });

        reportText += "\n";
      });
    });

    // Add comments if any
    reportText += `\n${"=".repeat(50)}\n`;
    reportText += "Generated by Hospital Management System\n";
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Test Selection Panel */}
        <TestSelectionPanel
          labTests={labTests}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          selectedTests={selectedTests}
          handleTestSelect={handleTestSelect}
        />

        {/* Test Parameters Panel */}
        <div className="xl:col-span-3">
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
            />
          )}

          {countSelectedTests() === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-gray-500 mb-4">
                <TestTube className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Tests Selected
              </h3>
              <p className="text-gray-600">
                Select tests from the panel on the left to begin creating a lab
                report.
              </p>
            </div>
          )}
        </div>
      </div>

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
