import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import {
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import { exportData, ExportOptions } from "../../../utils/exportUtils";
import toast from "react-hot-toast";

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  departments: string[];
  paymentMethods: string[];
  paymentTypes: string[];
  paymentSources: string[];
  isLoading?: boolean;
  // Export-related props
  exportData?: any[];
  exportColumns?: Array<{
    key: string;
    label: string;
    width?: number;
    formatter?: (value: any) => string;
  }>;
  exportTitle?: string;
  exportAdditionalInfo?: {
    totalRecords?: number;
    dateRange?: string;
    filters?: Record<string, string>;
  };
}

export interface FilterValues {
  search: string;
  department: string;
  payment_method: string;
  payment_type: string;
  payment_source: string;
  from_date: string;
  to_date: string;
}

interface Role {
  id: number;
  role: string;
}

interface RolesState {
  [key: string]: Role;
}

// Export Button Component
const ExportButton = ({
  data,
  columns,
  filename = "export",
  title,
  additionalInfo,
  className = "",
}: {
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
      toast.success(`Export completed successfully!`);
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
          text-white bg-primary border border-transparent rounded-lg
          hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
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

const PaymentTableFilter = ({
  onFilterChange,
  departments = [],
  paymentMethods = [],
  paymentTypes = [],
  paymentSources = [],
  isLoading = false,
  exportData = [],
  exportColumns = [],
  exportTitle = "Payments Report",
  exportAdditionalInfo,
}: FilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { register, handleSubmit, reset, watch, getValues } =
    useForm<FilterValues>({
      defaultValues: {
        search: "",
        department: "",
        payment_method: "",
        payment_type: "",
        payment_source: "",
        from_date: "",
        to_date: "",
      },
    });

  const { getAllRoles } = useGlobalStore();
  const roles = useGlobalStore((state) => state.roles) as RolesState;

  const allowedDepartments = ["pharmacist", "laboratory", "finance"];

  const getDepartmentOptions = () => {
    if (!roles) return [];
    return allowedDepartments
      .filter((dept) => roles[dept])
      .map((dept) => ({
        id: roles[dept]?.id.toString(),
        name: dept.charAt(0).toUpperCase() + dept.slice(1),
      }));
  };

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  const departmentOptions = getDepartmentOptions();
  const formValues = watch();

  // Track active filters count
  const activeFiltersCount = Object.values(formValues).filter(
    (value) => value !== ""
  ).length;

  // Apply filters when search input changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // Only apply search filter immediately
      if (formValues.search !== "") {
        onFilterChange(formValues);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [formValues.search, onFilterChange]);

  // Handle applying all filters
  const applyFilters = () => {
    const currentValues = getValues();
    onFilterChange(currentValues);
  };

  // Handle filter reset
  const handleReset = () => {
    reset({
      search: "",
      department: "",
      payment_method: "",
      payment_type: "",
      payment_source: "",
      from_date: "",
      to_date: "",
    });
    // Also apply the reset filters immediately
    onFilterChange({
      search: "",
      department: "",
      payment_method: "",
      payment_type: "",
      payment_source: "",
      from_date: "",
      to_date: "",
    });
  };

  return (
    <div className="mb-6 bg-white py-4 px-4 rounded custom-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            {...register("search")}
            placeholder="Search patient name, department, etc..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Export Button */}
          {exportData.length > 0 && exportColumns.length > 0 && (
            <ExportButton
              data={exportData}
              columns={exportColumns}
              filename="payments_report"
              title={exportTitle}
              additionalInfo={exportAdditionalInfo}
            />
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
            </svg>
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-primary rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                {...register("department")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name === "Pharmacist"
                      ? "Pharmacy"
                      : dept.name === "laboratory"
                      ? "Laboratory"
                      : dept.name === "finance"
                      ? "Finance"
                      : dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                {...register("payment_method")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Payment Methods</option>
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Payment Type
              </label>
              <select
                {...register("payment_type")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Payment Types</option>
                {paymentTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Payment Source
              </label>
              <select
                {...register("payment_source")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Sources</option>
                {paymentSources.map((source, index) => (
                  <option key={index} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                {...register("from_date")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                {...register("to_date")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTableFilter;
