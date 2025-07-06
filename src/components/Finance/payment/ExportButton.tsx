// components/ExportButton.tsx
import React, { useState } from "react";
import {
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import { exportData, ExportOptions } from "../../../utils/exportUtils";
import toast from "react-hot-toast";
// import { exportData, ExportOptions } from "../utils/exportUtils";

interface ExportButtonProps {
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    width?: number;
    formatter?: (value: any) => string;
  }>;
  filename?: string;
  title?: string;
  additionalInfo?: {
    totalRecords?: number;
    dateRange?: string;
    filters?: Record<string, string>;
  };
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  columns,
  filename = "export",
  title,
  additionalInfo,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    setIsExporting(true);
    setIsOpen(false);

    try {
      const exportOptions: ExportOptions = {
        filename,
        title,
        columns,
        data,
        additionalInfo,
      };

      exportData(format, exportOptions);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: "csv" as const,
      label: "Export as CSV",
      icon: FileText,
      description: "Comma-separated values",
    },
    {
      format: "excel" as const,
      label: "Export as Excel",
      icon: FileSpreadsheet,
      description: "Microsoft Excel format",
    },
    {
      format: "pdf" as const,
      label: "Export as PDF",
      icon: FileImage,
      description: "Portable document format",
    },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || data.length === 0}
        className={`
          inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium
          text-white bg-primary border border-transparent rounded-md
           focus:outline-none focus:ring-2 focus:ring-offset-2 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isExporting ? "animate-pulse" : ""}
        `}
      >
        <Download size={16} />
        {isExporting ? "Exporting..." : "Export"}
        <ChevronDown
          size={16}
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200">
            <div className="py-1">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.format}
                    onClick={() => handleExport(option.format)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 transition-colors"
                  >
                    <Icon size={18} className="text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {data.length === 0 && (
              <div className="px-4 py-3 text-xs text-gray-500 border-t">
                No data available to export
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
