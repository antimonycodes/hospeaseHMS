// LabPatientDetails.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import Loader from "../../../Shared/Loader";
import { ChevronLeft, TestTube, Upload } from "lucide-react";
import LabMedicalTimeline from "./LabMedicalTimeline";
import TestSelectionPanel from "./TestSelectionPanel";
import TestParametersPanel from "./TestParametersPanel";
import ReportPreviewModal from "./ReportPreviewModal";
import { labTests } from "./labTestData";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const LabPatientDetails = () => {
  const [departmentId, setDepartmentId] = useState<any>(null);

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
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [reportMode, setReportMode] = useState<"create" | "upload">("create"); // New state for mode
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
      // getSingleReport(patientId);
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
      hospitalName: defaultHospitalName || "",
      reportTitle: " LABORATORY REPORT",
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

  // Check if there are any tests with filled parameters
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

  // Generate PDF as Blob for submission

  const generatePDFBlob = async (): Promise<Blob> => {
    const doc = new jsPDF();
    doc.setLineHeightFactor(1); // reduce global line spacing
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
  // const generatePDFBlob = async (): Promise<Blob> => {
  //   // Initialize PDF with compact settings
  //   const doc = new jsPDF({
  //     unit: "mm",
  //     format: "a4",
  //     compress: true,
  //   });

  //   const header = generatePatientReportHeader();
  //   let yPosition = 15; // Reduced initial spacing

  //   // Set compact font settings
  //   doc.setFont("helvetica");
  //   doc.setFontSize(12); // Base font size

  //   // Hospital header - more compact
  //   doc.setFontSize(14);
  //   doc.setFont("helvetica", "bold");
  //   doc.text(header.hospitalName, 105, yPosition, { align: "center" });
  //   yPosition += 7;

  //   doc.setFontSize(12);
  //   doc.text(header.reportTitle, 105, yPosition, { align: "center" });
  //   yPosition += 10;

  //   // Compact divider line
  //   doc.setLineWidth(0.3);
  //   doc.line(15, yPosition, 195, yPosition);
  //   yPosition += 8;

  //   // Two-column layout with tighter spacing
  //   const column1X = 15;
  //   const column2X = 105;
  //   const columnWidth = 85;
  //   let column1Y = yPosition;
  //   let column2Y = yPosition;

  //   // Patient Information - Compact
  //   doc.setFontSize(10);
  //   doc.setFont("helvetica", "bold");
  //   doc.text("PATIENT INFORMATION:", column1X, column1Y);
  //   column1Y += 5;

  //   doc.setFont("helvetica", "normal");
  //   const patientInfo = [
  //     `Name: ${header.patientInfo.name}`,
  //     `ID: ${header.patientInfo.patientId}`,
  //     `Age/Sex: ${header.patientInfo.age}/${header.patientInfo.gender}`,
  //     `Phone: ${header.patientInfo.phone}`,
  //     `Address: ${header.patientInfo.address}`,
  //   ];

  //   patientInfo.forEach((info) => {
  //     doc.text(info, column1X, column1Y);
  //     column1Y += 5; // Tight line spacing
  //   });

  //   // Report Information - Compact
  //   doc.setFont("helvetica", "bold");
  //   doc.text("REPORT INFORMATION:", column2X, column2Y);
  //   column2Y += 5;

  //   doc.setFont("helvetica", "normal");
  //   doc.text(`Date: ${header.reportInfo.date}`, column2X, column2Y);
  //   column2Y += 5;
  //   doc.text(`Time: ${header.reportInfo.time}`, column2X, column2Y);
  //   column2Y += 5;
  //   doc.text(`Status: ${status}`, column2X, column2Y);
  //   column2Y += 5;

  //   // Set yPosition to the bottom of the longer column
  //   yPosition = Math.max(column1Y, column2Y) + 10;

  //   // Prepare categories with test data
  //   const categoriesWithData: Array<{
  //     category: string;
  //     tests: string[];
  //   }> = [];

  //   Object.entries(selectedTests).forEach(([category, tests]) => {
  //     const testsWithData = tests.filter((testName) => {
  //       const testData = labTests[category]?.tests[testName];
  //       if (!testData) return false;

  //       const results = testResults[testName] || {};
  //       return testData.parameters.some((param: any) => {
  //         const value = results[param.name];
  //         return value && value.toString().trim() !== "";
  //       });
  //     });

  //     if (testsWithData.length > 0) {
  //       categoriesWithData.push({ category, tests: testsWithData });
  //     }
  //   });

  //   // Two-column layout configuration
  //   const leftColumnX = 15;
  //   const rightColumnX = 105;
  //   const pageHeight = 280;
  //   let leftColumnY = yPosition;
  //   let rightColumnY = yPosition;
  //   let currentColumn: "left" | "right" = "left";

  //   // Helper function to calculate category height
  //   const calculateCategoryHeight = (
  //     category: string,
  //     tests: string[]
  //   ): number => {
  //     let height = 8; // Reduced category header space

  //     tests.forEach((testName) => {
  //       const testData = labTests[category]?.tests[testName];
  //       if (!testData) return;

  //       const results = testResults[testName] || {};

  //       height += 6; // Reduced test name space

  //       testData.parameters.forEach((param: any) => {
  //         const value = results[param.name];
  //         if (value && value.toString().trim() !== "") {
  //           height += 6; // Reduced parameter space
  //           if (param.normalRange) {
  //             height += 4; // Reduced normal range space
  //           }
  //         }
  //       });
  //     });

  //     return height;
  //   };

  //   // Helper function to render category content
  //   const renderCategory = (
  //     category: string,
  //     tests: string[],
  //     startX: number,
  //     startY: number
  //   ): number => {
  //     let currentY = startY;

  //     // Draw category header
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(10);
  //     doc.text(category.toUpperCase(), startX, currentY);
  //     currentY += 5;

  //     // Draw tests for this category
  //     tests.forEach((testName) => {
  //       const testData = labTests[category]?.tests[testName];
  //       if (!testData) return;

  //       const results = testResults[testName] || {};
  //       const filledParameters = testData.parameters.filter((param: any) => {
  //         const value = results[param.name];
  //         return value && value.toString().trim() !== "";
  //       });

  //       if (filledParameters.length > 0) {
  //         // Test name
  //         doc.setFont("helvetica", "bold");
  //         doc.setFontSize(9);
  //         doc.text(testName, startX + 2, currentY);
  //         currentY += 4;

  //         // Parameters
  //         doc.setFont("helvetica", "normal");
  //         doc.setFontSize(8);

  //         filledParameters.forEach((param: any) => {
  //           const value = results[param.name];
  //           // Compact parameter display
  //           const paramText = `${param.name}: ${value}${
  //             param.unit ? ` ${param.unit}` : ""
  //           }`;
  //           doc.text(paramText, startX + 5, currentY);
  //           currentY += 3.5;

  //           // Only show normal range if it exists
  //           if (param.normalRange) {
  //             doc.setTextColor(100, 100, 100);
  //             doc.setFontSize(7);
  //             doc.text(`(${param.normalRange})`, startX + 8, currentY);
  //             doc.setTextColor(0, 0, 0);
  //             doc.setFontSize(8);
  //             currentY += 3;
  //           }
  //         });
  //       }
  //     });

  //     return currentY;
  //   };

  //   // Process categories with smart column balancing
  //   categoriesWithData.forEach((categoryData) => {
  //     const { category, tests } = categoryData;
  //     const categoryHeight = calculateCategoryHeight(category, tests);

  //     // Check if we need to switch columns or add new page
  //     if (currentColumn === "left") {
  //       if (leftColumnY + categoryHeight > pageHeight) {
  //         if (rightColumnY + categoryHeight <= pageHeight) {
  //           currentColumn = "right";
  //         } else {
  //           doc.addPage();
  //           leftColumnY = 15;
  //           rightColumnY = 15;
  //           currentColumn = "left";
  //         }
  //       }
  //     } else {
  //       if (rightColumnY + categoryHeight > pageHeight) {
  //         doc.addPage();
  //         leftColumnY = 15;
  //         rightColumnY = 15;
  //         currentColumn = "left";
  //       }
  //     }

  //     // Render the category in the appropriate column
  //     if (currentColumn === "left") {
  //       leftColumnY = renderCategory(category, tests, leftColumnX, leftColumnY);
  //       leftColumnY += 4; // Reduced space between categories
  //     } else {
  //       rightColumnY = renderCategory(
  //         category,
  //         tests,
  //         rightColumnX,
  //         rightColumnY
  //       );
  //       rightColumnY += 4; // Reduced space between categories
  //     }
  //   });

  //   // Compact footer
  //   const footerY = Math.max(leftColumnY, rightColumnY);
  //   let finalY = footerY;

  //   if (finalY > pageHeight - 10) {
  //     doc.addPage();
  //     finalY = 15;
  //   }

  //   doc.setLineWidth(0.3);
  //   doc.line(15, finalY, 195, finalY);
  //   finalY += 5;

  //   doc.setFont("helvetica", "italic");
  //   doc.setFontSize(7);
  //   doc.text(`Report ID: HMS-${Date.now()}`, 15, finalY);

  //   return doc.output("blob");
  // };

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
        note:
          reportMode === "upload"
            ? " Lab Report"
            : "Comprehensive Laboratory Report",
        status,
        testResults: {},
        patientHeader: generatePatientReportHeader(),
      };

      if (reportMode === "upload") {
        // Upload mode - use the uploaded file
        if (!file) {
          toast.error("Please select a file to upload");
          return;
        }
        formData.file = file;
      } else {
        // Create mode - generate PDF only if there are filled test results
        if (!hasFilledTestResults()) {
          toast.error(
            "Please fill in at least one test parameter before submitting"
          );
          return;
        }

        // Generate PDF blob
        const pdfBlob = await generatePDFBlob();

        // Convert blob to File
        const pdfFile = new File([pdfBlob], `Lab_Report_${Date.now()}.pdf`, {
          type: "application/pdf",
        });

        // Structure test results by category
        const structuredResults: { [category: string]: any } = {};
        Object.entries(selectedTests).forEach(([category, tests]) => {
          structuredResults[category] = {};
          tests.forEach((testName) => {
            const testData = labTests[category].tests[testName];
            const results = testResults[testName] || {};

            // Only include tests with filled parameters
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

      const success = await respondToReport(caseId, formData);
      if (success) {
        await getSingleReport(patientId);
        setSelectedTests({});
        setTestResults({});
        setStatus("In Progress");
        setFile(null);
        setReportMode("create");
        toast.success("Lab report submitted successfully!");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report. Please try again.");
    }
  };

  // const handleCreateReport = async () => {
  //   const reportData = {
  //     patient_id: patientId?.toString(),
  //     note: "",
  //     file,
  //     status: "completed",
  //     role: "laboratory",
  //     department_id: departmentId,
  //   };
  //   const deptResponse = await deptCreateReport(reportData);
  // };

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

    // Add test results for each category - only include filled parameters
    Object.entries(selectedTests).forEach(([category, tests]) => {
      // Filter tests that have filled parameters
      const testsWithData = tests.filter((testName) => {
        const testData = labTests[category].tests[testName];
        const results = testResults[testName] || {};
        return testData.parameters.some((param) => {
          const value = results[param.name];
          return value && value.toString().trim() !== "";
        });
      });

      // Only add category if it has tests with data
      if (testsWithData.length > 0) {
        reportText += `\n${category.toUpperCase()}:\n${"-".repeat(
          category.length
        )}\n`;

        testsWithData.forEach((testName) => {
          const testData = labTests[category].tests[testName];
          const results = testResults[testName] || {};

          // Check if this test has filled parameters
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

    // Add comments if any
    reportText += `\n${"=".repeat(50)}\n`;
    // reportText += "Generated by Hospital Management System\n";
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
            Create Lab Report
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
            Upload External Report
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
            // Create Report Mode
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
                    Select tests from the panel on the left to begin creating a
                    lab report.
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
                  Upload External Lab Report
                </h3>
                <p className="text-gray-600">
                  Upload a lab report file (PDF, DOC, DOCX, JPG, PNG) for this
                  patient.
                </p>
              </div>

              <div className="space-y-4">
                {/* File Upload */}
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

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleReportSubmit}
                    disabled={!file || isResponding}
                    className="px-6 py-2 bg-primary text-white rounded-lg  disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResponding ? "Uploading..." : "Upload Report"}
                  </button>
                </div>
              </div>
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
