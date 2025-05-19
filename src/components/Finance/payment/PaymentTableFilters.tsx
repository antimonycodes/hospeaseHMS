import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  departments: string[];
  paymentMethods: string[];
  paymentTypes: string[];
  paymentSources: string[];
  isLoading?: boolean;
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

const PaymentTableFilter = ({
  onFilterChange,
  departments = [],
  paymentMethods = [],
  paymentTypes = [],
  paymentSources = [],
  isLoading = false,
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
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 ml-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
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
              className="px-4 py-2 ml-2 text-sm font-medium text-primary bg-white border border-primary rounded-lg hover:bg-gray-50"
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
            {/* <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button> */}
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
