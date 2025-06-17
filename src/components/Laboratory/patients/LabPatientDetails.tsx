import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import Loader from "../../../Shared/Loader";
import {
  Loader2,
  FileText,
  Download,
  Search,
  Eye,
  Save,
  User,
  Calendar,
  Clock,
  TestTube,
  ChevronDown,
  ChevronRight,
  Microscope,
  Activity,
  ChevronLeft,
} from "lucide-react";
import LabMedicalTimeline from "./LabMedicalTimeline";
import jsPDF from "jspdf";

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

  // Enhanced state management
  type TestResults = { [key: string]: string | number | undefined } & {
    comments?: string;
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [testResults, setTestResults] = useState<TestResults>({});
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState("In Progress");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [additionalFiles, setAdditionalFiles] = useState([]);

  const navigate = useNavigate();

  // Comprehensive lab test categories and parameters
  type LabTestParameter = {
    name: string;
    unit: string;
    normalRange: string;
    type: string;
    options?: string[];
  };

  type LabTest = {
    parameters: LabTestParameter[];
  };

  type LabTestCategory = {
    icon: React.ReactNode;
    tests: {
      [testName: string]: LabTest;
    };
  };

  type LabTestsType = {
    [category: string]: LabTestCategory;
  };

  const labTests: LabTestsType = {
    Hematology: {
      icon: <Activity className="h-5 w-5" />,
      tests: {
        "Complete Blood Count (CBC)": {
          parameters: [
            {
              name: "White Blood Cells (WBC)",
              unit: "cells/μL",
              normalRange: "4,000-11,000",
              type: "number",
            },
            {
              name: "Red Blood Cells (RBC)",
              unit: "cells/μL",
              normalRange: "4.5-5.5 million",
              type: "number",
            },
            {
              name: "Hemoglobin (Hgb)",
              unit: "g/dL",
              normalRange: "12-16",
              type: "number",
            },
            {
              name: "Hematocrit (Hct)",
              unit: "%",
              normalRange: "36-46",
              type: "number",
            },
            {
              name: "Platelets",
              unit: "cells/μL",
              normalRange: "150,000-450,000",
              type: "number",
            },
            {
              name: "Mean Corpuscular Volume (MCV)",
              unit: "fL",
              normalRange: "80-100",
              type: "number",
            },
          ],
        },
        "Erythrocyte Sedimentation Rate (ESR)": {
          parameters: [
            {
              name: "ESR",
              unit: "mm/hr",
              normalRange: "Men: 2-10, Women: 3-15",
              type: "number",
            },
          ],
        },
        "Bleeding Time": {
          parameters: [
            {
              name: "Bleeding Time",
              unit: "minutes",
              normalRange: "2-7",
              type: "number",
            },
            {
              name: "Clotting Time",
              unit: "minutes",
              normalRange: "3-8",
              type: "number",
            },
          ],
        },
      },
    },
    "Clinical Chemistry": {
      icon: <TestTube className="h-5 w-5" />,
      tests: {
        "Liver Function Tests (LFT)": {
          parameters: [
            {
              name: "ALT (SGPT)",
              unit: "U/L",
              normalRange: "7-56",
              type: "number",
            },
            {
              name: "AST (SGOT)",
              unit: "U/L",
              normalRange: "10-40",
              type: "number",
            },
            {
              name: "Alkaline Phosphatase",
              unit: "U/L",
              normalRange: "44-147",
              type: "number",
            },
            {
              name: "Total Bilirubin",
              unit: "mg/dL",
              normalRange: "0.3-1.2",
              type: "number",
            },
            {
              name: "Direct Bilirubin",
              unit: "mg/dL",
              normalRange: "0.1-0.3",
              type: "number",
            },
            {
              name: "Total Protein",
              unit: "g/dL",
              normalRange: "6.0-8.3",
              type: "number",
            },
            {
              name: "Albumin",
              unit: "g/dL",
              normalRange: "3.5-5.0",
              type: "number",
            },
          ],
        },
        "Kidney Function Tests (KFT)": {
          parameters: [
            {
              name: "Blood Urea Nitrogen (BUN)",
              unit: "mg/dL",
              normalRange: "7-20",
              type: "number",
            },
            {
              name: "Creatinine",
              unit: "mg/dL",
              normalRange: "0.7-1.3",
              type: "number",
            },
            {
              name: "Uric Acid",
              unit: "mg/dL",
              normalRange: "3.4-7.0",
              type: "number",
            },
            {
              name: "eGFR",
              unit: "mL/min/1.73m²",
              normalRange: ">60",
              type: "number",
            },
          ],
        },
        "Lipid Profile": {
          parameters: [
            {
              name: "Total Cholesterol",
              unit: "mg/dL",
              normalRange: "<200",
              type: "number",
            },
            {
              name: "HDL Cholesterol",
              unit: "mg/dL",
              normalRange: ">40 (M), >50 (F)",
              type: "number",
            },
            {
              name: "LDL Cholesterol",
              unit: "mg/dL",
              normalRange: "<100",
              type: "number",
            },
            {
              name: "Triglycerides",
              unit: "mg/dL",
              normalRange: "<150",
              type: "number",
            },
          ],
        },
        "Blood Glucose": {
          parameters: [
            {
              name: "Fasting Blood Sugar",
              unit: "mg/dL",
              normalRange: "70-100",
              type: "number",
            },
            {
              name: "Random Blood Sugar",
              unit: "mg/dL",
              normalRange: "<140",
              type: "number",
            },
            { name: "HbA1c", unit: "%", normalRange: "<5.7", type: "number" },
          ],
        },
      },
    },
    Serology: {
      icon: <Microscope className="h-5 w-5" />,
      tests: {
        "Widal Test": {
          parameters: [
            {
              name: "Salmonella Typhi O",
              unit: "Titre",
              normalRange: "<1:80",
              type: "text",
            },
            {
              name: "Salmonella Typhi H",
              unit: "Titre",
              normalRange: "<1:80",
              type: "text",
            },
            {
              name: "Salmonella Paratyphi A",
              unit: "Titre",
              normalRange: "<1:80",
              type: "text",
            },
            {
              name: "Salmonella Paratyphi B",
              unit: "Titre",
              normalRange: "<1:80",
              type: "text",
            },
          ],
        },
        "Hepatitis Panel": {
          parameters: [
            {
              name: "HBsAg",
              unit: "",
              normalRange: "Non-reactive",
              type: "select",
              options: ["Reactive", "Non-reactive"],
            },
            {
              name: "HCV Ab",
              unit: "",
              normalRange: "Non-reactive",
              type: "select",
              options: ["Reactive", "Non-reactive"],
            },
            {
              name: "HAV IgM",
              unit: "",
              normalRange: "Non-reactive",
              type: "select",
              options: ["Reactive", "Non-reactive"],
            },
          ],
        },
        "HIV Test": {
          parameters: [
            {
              name: "HIV 1 & 2",
              unit: "",
              normalRange: "Non-reactive",
              type: "select",
              options: ["Reactive", "Non-reactive"],
            },
          ],
        },
      },
    },
    Microbiology: {
      icon: <Activity className="h-5 w-5" />,
      tests: {
        "Urine Culture": {
          parameters: [
            {
              name: "Organism Isolated",
              unit: "",
              normalRange: "No growth",
              type: "text",
            },
            {
              name: "Colony Count",
              unit: "CFU/mL",
              normalRange: "<10^5",
              type: "text",
            },
            {
              name: "Sensitivity",
              unit: "",
              normalRange: "",
              type: "textarea",
            },
          ],
        },
        "Blood Culture": {
          parameters: [
            {
              name: "Organism Isolated",
              unit: "",
              normalRange: "No growth",
              type: "text",
            },
            {
              name: "Sensitivity",
              unit: "",
              normalRange: "",
              type: "textarea",
            },
          ],
        },
        "Stool Culture": {
          parameters: [
            {
              name: "Organism Isolated",
              unit: "",
              normalRange: "No pathogen",
              type: "text",
            },
            {
              name: "Parasites",
              unit: "",
              normalRange: "None seen",
              type: "text",
            },
            {
              name: "Ova/Cysts",
              unit: "",
              normalRange: "None seen",
              type: "text",
            },
          ],
        },
      },
    },
    Urinalysis: {
      icon: <TestTube className="h-5 w-5" />,
      tests: {
        "Routine Urine Examination": {
          parameters: [
            {
              name: "Color",
              unit: "",
              normalRange: "Pale yellow",
              type: "text",
            },
            {
              name: "Appearance",
              unit: "",
              normalRange: "Clear",
              type: "text",
            },
            {
              name: "Specific Gravity",
              unit: "",
              normalRange: "1.003-1.030",
              type: "number",
            },
            { name: "pH", unit: "", normalRange: "5.0-8.0", type: "number" },
            {
              name: "Protein",
              unit: "",
              normalRange: "Negative",
              type: "select",
              options: ["Negative", "Trace", "+", "++", "+++"],
            },
            {
              name: "Glucose",
              unit: "",
              normalRange: "Negative",
              type: "select",
              options: ["Negative", "Trace", "+", "++", "+++"],
            },
            {
              name: "Ketones",
              unit: "",
              normalRange: "Negative",
              type: "select",
              options: ["Negative", "Trace", "+", "++", "+++"],
            },
            {
              name: "Blood",
              unit: "",
              normalRange: "Negative",
              type: "select",
              options: ["Negative", "Trace", "+", "++", "+++"],
            },
            { name: "WBC", unit: "/hpf", normalRange: "0-5", type: "number" },
            { name: "RBC", unit: "/hpf", normalRange: "0-2", type: "number" },
            {
              name: "Epithelial Cells",
              unit: "/hpf",
              normalRange: "Few",
              type: "text",
            },
            { name: "Bacteria", unit: "", normalRange: "Few", type: "text" },
          ],
        },
      },
    },
  };

  useEffect(() => {
    if (patientId) {
      getLabPatientById(patientId);
      getSingleReport(patientId);
    }
  }, [patientId, getLabPatientById, getSingleReport, caseId]);

  const patient = selectedPatient?.attributes;

  const handleTestSelect = (
    category: React.SetStateAction<string>,
    test: React.SetStateAction<string>
  ) => {
    setSelectedCategory(category);
    setSelectedTest(test);
    setTestResults({});
  };

  const handleParameterChange = (paramName: string, value: string) => {
    setTestResults((prev) => ({
      ...prev,
      [paramName]: value,
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
      reportTitle: "LABORATORY REPORT",
      patientInfo: {
        name: `${patient?.first_name || ""} ${patient?.last_name || ""}`.trim(),
        patientId: patient?.card_id || "",
        age: patient?.age || "",
        gender: patient?.gender || "",
        phone: patient?.phone_number || "",
        address: patient?.address || "",
      },
      testInfo: {
        category: selectedCategory,
        test: selectedTest,
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
      },
    };
  };

  const generateReportImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context for canvas.");
    }

    // Set canvas size (standard letter size at 96 DPI)
    canvas.width = 816; // 8.5 inches * 96 DPI
    canvas.height = 1056; // 11 inches * 96 DPI

    // White background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    const header = generatePatientReportHeader();

    // Header
    ctx.fillStyle = "#333";
    ctx.font = "bold 28px Arial";
    ctx.fillText("LABORATORY REPORT", 50, 80);

    // Underline
    ctx.beginPath();
    ctx.moveTo(50, 90);
    ctx.lineTo(400, 90);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Patient Information Section
    ctx.font = "bold 18px Arial";
    ctx.fillText("Patient Information:", 50, 140);

    ctx.font = "16px Arial";
    let yPos = 170;
    const patientInfo = [
      `Name: ${header.patientInfo?.name || "N/A"}`,
      `ID: ${header.patientInfo?.patientId || "N/A"}`,
      `Date: ${header.testInfo?.date || new Date().toLocaleDateString()}`,
      `Test Category: ${selectedCategory}`,
      `Test Name: ${selectedTest}`,
    ];

    patientInfo.forEach((info) => {
      ctx.fillText(info, 70, yPos);
      yPos += 25;
    });

    // Test Results Section
    yPos += 20;
    ctx.font = "bold 18px Arial";
    ctx.fillText("Test Results:", 50, yPos);

    yPos += 30;
    ctx.font = "16px Arial";

    if (Object.keys(testResults).length > 0) {
      Object.entries(testResults).forEach(([key, value]) => {
        ctx.fillText(`${key}: ${value}`, 70, yPos);
        yPos += 25;
      });
    } else {
      ctx.fillText("No results available", 70, yPos);
    }

    // Footer
    ctx.font = "12px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText(
      `Generated on: ${new Date().toLocaleString()}`,
      50,
      canvas.height - 60
    );
    ctx.fillText(`Status: ${status}`, 50, canvas.height - 40);

    return canvas;
  };

  const handleReportSubmit = async () => {
    // if (!selectedTest || Object.keys(testResults).length === 0  ) {
    //   alert("Please select a test and fill in the results");
    //   return;
    // }

    try {
      const canvas = generateReportImage();

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 0.95);
      });

      const file = new File(
        [blob as BlobPart],
        `Lab_Report_${selectedTest}_${
          new Date().toISOString().split("T")[0]
        }.png`,
        { type: "image/png" }
      );

      const formData = {
        note: `Digital Lab Report: ${selectedTest}`,
        status,
        file,
        testCategory: selectedCategory,
        testName: selectedTest,
        testResults: testResults,
        patientHeader: generatePatientReportHeader(),
      };

      const success = await respondToReport(caseId, formData);
      if (success) {
        await getSingleReport(patientId);
        setTestResults({});
        setSelectedTest("");
        setSelectedCategory("");
        setStatus("In Progress");
        alert("Lab report submitted successfully!");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    }
  };

  const downloadReport = () => {
    try {
      const canvas = generateReportImage();

      // Convert to blob and download
      canvas.toBlob(
        (blob: any) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Lab_Report_${selectedTest}_${
            new Date().toISOString().split("T")[0]
          }.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        "image/png",
        0.95
      );
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Error downloading report. Please try again.");
    }
  };

  const generateReportContent = (header: {
    hospitalName: any;
    reportTitle: any;
    patientInfo: {
      name: any;
      patientId: any;
      age: any;
      gender: any;
      phone: any;
      address: any;
    };
    testInfo: { category: any; test: any; date: any; time: any };
  }) => {
    return `
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

TEST INFORMATION:
-----------------
Test Category: ${header.testInfo.category}
Test Name: ${header.testInfo.test}
Date: ${header.testInfo.date}
Time: ${header.testInfo.time}

RESULTS:
--------
${Object.entries(testResults)
  .map(([param, value]) => `${param}: ${value}`)
  .join("\n")}

${"=".repeat(50)}
Generated by Hospital Management System
Report ID: HMS-${Date.now()}
    `;
  };

  const renderParameterInput = (param: {
    name: string;
    type: string | (string & {}) | undefined;
    options: any[];
  }) => {
    const value = testResults[param.name] || "";

    switch (param.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select...</option>
            {param.options?.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter details..."
          />
        );
      default:
        return (
          <input
            type={param.type}
            value={value}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`Enter ${param.name.toLowerCase()}`}
          />
        );
    }
  };

  const filteredTests = Object.entries(labTests).reduce(
    (acc: Record<string, any>, [category, categoryData]) => {
      const filteredCategoryTests = Object.entries(categoryData.tests).filter(
        ([testName]) =>
          testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredCategoryTests.length > 0) {
        acc[category] = {
          ...categoryData,
          tests: Object.fromEntries(filteredCategoryTests),
        };
      }
      return acc;
    },
    {} as Record<string, any>
  );

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

      {/* Enhanced Digital Laboratory Test System */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Test Selection Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <div className="flex items-center mb-4">
              <TestTube className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Lab Tests</h2>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Test Categories */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(filteredTests).map(
                ([category, categoryData]: any) => (
                  <div
                    key={category}
                    className="border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        {categoryData.icon}
                        <span className="ml-2 font-medium text-gray-900">
                          {category}
                        </span>
                      </div>
                      {expandedCategories[category] ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>

                    {expandedCategories[category] && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {Object.entries(categoryData.tests).map(
                          ([testName]) => (
                            <button
                              key={testName}
                              onClick={() =>
                                handleTestSelect(category, testName)
                              }
                              className={`w-full text-left p-3 text-sm hover:bg-white transition-colors duration-200 ${
                                selectedTest === testName
                                  ? "bg-blue-50 text-blue-800 border-l-4 border-blue-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {testName}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Test Parameters Panel */}
        <div className="xl:col-span-3">
          {selectedTest && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Microscope className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedTest}
                    </h2>
                    <p className="text-gray-600">{selectedCategory}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={downloadReport}
                    disabled={Object.keys(testResults).length === 0}
                    className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>

              {/* Parameters Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {labTests[selectedCategory]?.tests[
                  selectedTest
                ]?.parameters.map((param: any, index: any) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {param.name}
                      {param.unit && (
                        <span className="text-gray-500 ml-1 font-normal">
                          ({param.unit})
                        </span>
                      )}
                    </label>
                    {renderParameterInput(param)}
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      Normal range: {param.normalRange}
                    </p>
                  </div>
                ))}
              </div>

              {/* Comments Section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Comments/Observations
                </label>
                <textarea
                  value={testResults.comments || ""}
                  onChange={(e) =>
                    handleParameterChange("comments", e.target.value)
                  }
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter any additional observations, recommendations, or notes..."
                />
              </div>
            </div>
          )}

          {/* Status and Submit */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            {/* Status Dropdown */}
            <div className="mb-4">
              <h4 className="text-gray-600 text-sm mb-2">Progress Status</h4>
              <select
                className="w-full appearance-none bg-white border border-gray-300 rounded-md p-2 pr-8"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mb-4">
              <input
                type="file"
                className="w-full border border-gray-300 rounded-md p-2"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>

            <button
              className={`px-8 py-3 bg-primary text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isResponding ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleReportSubmit}
              disabled={isResponding}
            >
              {isResponding ? (
                <>
                  Submitting
                  <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LabPatientDetails;
