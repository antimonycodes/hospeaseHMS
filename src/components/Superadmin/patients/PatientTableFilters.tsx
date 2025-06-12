import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  patientCategories: { id: number; name: string }[];
  branches: string[];
  genders: string[];
  occupations: string[];
  isLoading?: boolean;
}

export interface FilterValues {
  search: string;
  patient_category_id: string;
  branch: string;
  gender: string;
  occupation: string;
  age_from: string;
  age_to: string;
}

const PatientTableFilters = ({
  onFilterChange,
  patientCategories = [],
  branches = [],
  genders = [],
  occupations = [],
  isLoading = false,
}: FilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { register, handleSubmit, reset, watch, getValues } =
    useForm<FilterValues>({
      defaultValues: {
        search: "",
        patient_category_id: "",
        branch: "",
        gender: "",
        occupation: "",
        age_from: "",
        age_to: "",
      },
    });

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
      patient_category_id: "",
      branch: "",
      gender: "",
      occupation: "",
      age_from: "",
      age_to: "",
    });

    // Also apply the reset filters immediately
    onFilterChange({
      search: "",
      patient_category_id: "",
      branch: "",
      gender: "",
      occupation: "",
      age_from: "",
      age_to: "",
    });
  };

  return (
    <div className="mb-6 bg-white py-4 px-4 rounded custom-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            {...register("search")}
            placeholder="Search patient name, ID, phone..."
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
                Patient Category
              </label>
              <select
                {...register("patient_category_id")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Categories</option>
                {patientCategories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Branch
              </label>
              <select
                {...register("branch")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Branches</option>
                {branches.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Genders</option>
                {genders.map((gender, index) => (
                  <option key={index} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Occupation
              </label>
              <select
                {...register("occupation")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">All Occupations</option>
                {occupations.map((occupation, index) => (
                  <option key={index} value={occupation}>
                    {occupation}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Age From
              </label>
              <input
                type="number"
                {...register("age_from")}
                placeholder="Min age"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Age To
              </label>
              <input
                type="number"
                {...register("age_to")}
                placeholder="Max age"
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

export default PatientTableFilters;
