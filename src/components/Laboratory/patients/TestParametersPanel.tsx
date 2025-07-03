// TestParametersPanel.tsx
import React from "react";
import { Download, Eye, FileText, Loader2, Save, TestTube } from "lucide-react";
import { LabTestsType } from "./labTestTypes";

interface TestParametersPanelProps {
  labTests: LabTestsType;
  selectedTests: { [category: string]: string[] };
  testResults: { [testName: string]: { [param: string]: string | number } };
  handleParameterChange: (
    testName: string,
    paramName: string,
    value: string
  ) => void;
  setShowPreview: (show: boolean) => void;
  status: string;
  setStatus: (status: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  isResponding: boolean;
  handleReportSubmit: () => void;
  generateReportContent: () => string;
  generatePDFBlob: () => Promise<Blob>;
}

const TestParametersPanel: React.FC<TestParametersPanelProps> = ({
  labTests,
  selectedTests,
  testResults,
  handleParameterChange,
  setShowPreview,
  status,
  setStatus,
  file,
  setFile,
  isResponding,
  handleReportSubmit,
  generateReportContent,
  generatePDFBlob,
}) => {
  const renderParameterInput = (
    testName: string,
    param: {
      name: string;
      type: string;
      options?: string[];
      unit?: string;
    }
  ) => {
    const value = testResults[testName]?.[param.name] || "";

    switch (param.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) =>
              handleParameterChange(testName, param.name, e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select...</option>
            {param.options?.map((option) => (
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
            onChange={(e) =>
              handleParameterChange(testName, param.name, e.target.value)
            }
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
            onChange={(e) =>
              handleParameterChange(testName, param.name, e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`Enter ${param.name.toLowerCase()}`}
          />
        );
    }
  };

  const downloadPDFReport = async () => {
    try {
      const pdfBlob = await generatePDFBlob();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Lab_Report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      {/* Test Parameters Sections */}
      {Object.entries(selectedTests).map(([category, tests]) => (
        <div key={category} className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {labTests[category].icon}
              <div className="ml-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category}
                </h2>
                <p className="text-gray-600">
                  {tests.length} test{tests.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
          </div>

          {tests.map((testName) => (
            <div key={testName} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {testName}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {labTests[category].tests[testName].parameters.map(
                  (param: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {param.name}
                        {param.unit && (
                          <span className="text-gray-500 ml-1 font-normal">
                            ({param.unit})
                          </span>
                        )}
                      </label>
                      {renderParameterInput(testName, param)}
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        Normal range: {param.normalRange}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Status and Submit */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Report Summary
            </h3>
            <p className="text-gray-600">
              {Object.values(selectedTests).reduce(
                (total, tests) => total + tests.length,
                0
              )}{" "}
              tests selected
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button
              onClick={downloadPDFReport}
              className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Status
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              {/* <option value="Pending Review">Pending Review</option> */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach Additional Files
            </label>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter any additional comments or observations..."
          />
        </div>

        <button
          className={`w-full px-6 py-3 bg-primary text-white font-medium rounded-lg flex items-center justify-center transition-colors duration-200 ${
            isResponding ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleReportSubmit}
          disabled={isResponding}
        >
          {isResponding ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Submitting PDF Report...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Submit Complete PDF Report
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default TestParametersPanel;
