export interface FluidEntry {
  id: any;
  type: string;
  date: string;
  time: string;
  ivInput: number;
  oralInput: number;
  urineOutput: number;
  vomitusOutput: number;
  others: string;
  comments: string;
  recordedBy: string;
  created_at: any;
  updated_at: string;
}

/**
 * Extract numeric value from a string like "500ml" or "100"
 * @param {string} value - The value to parse
 * @returns {number} - The numeric value
 */
export const parseFluidValue = (value: { toString: () => string }) => {
  if (!value) return 0;
  const numericValue = value.toString().replace(/[^0-9]/g, "");
  return parseInt(numericValue) || 0;
};

/**
 * Format a numeric value to include "ml" unit
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted value with "ml"
 */
export const formatFluidValue = (value: string) => {
  const numericValue = parseInt(value) || 0;
  return numericValue === 0 ? "0ml" : `${numericValue}ml`;
};

/**
 * Transform API fluid balance entry to component format
 * @param {Object} apiEntry - Entry from API
 * @param {Object} recordedBy - User who recorded the entry
 * @returns {Object} - Transformed entry for component
 */
export const transformApiEntryToComponent = (
  apiEntry: {
    created_at: string | number | Date;
    id: any;
    type: any;
    iv_input: any;
    oral_input: any;
    urine_input: any;
    vomits_input: any;
    other_input: any;
    comment: any;
    updated_at: any;
  },
  recordedBy: { first_name: string; last_name: string } | null = null
) => {
  const createdDate = new Date(apiEntry.created_at);

  return {
    id: apiEntry.id,
    type: apiEntry.type,
    date: createdDate.toISOString().split("T")[0],
    time: createdDate.toTimeString().slice(0, 5),
    ivInput: parseFluidValue(apiEntry.iv_input),
    oralInput: parseFluidValue(apiEntry.oral_input),
    urineOutput: parseFluidValue(apiEntry.urine_input),
    vomitusOutput: parseFluidValue(apiEntry.vomits_input),
    others: apiEntry.other_input || "",
    comments: apiEntry.comment || "",
    recordedBy: recordedBy
      ? `${recordedBy.first_name} ${recordedBy.last_name}`
      : "Unknown",
    created_at: apiEntry.created_at,
    updated_at: apiEntry.updated_at,
  };
};

/**
 * Transform component form data to API format
 * @param {Object} formData - Form data from component
 * @param {number} admissionId - The admission ID
 * @returns {Object} - Data formatted for API
 */
export const transformComponentToApiData = (
  formData: {
    type: any;
    ivInput: any;
    oralInput: any;
    urineOutput: any;
    vomitusOutput: any;
    others: any;
    comments: any;
  },
  admissionId: any
) => {
  return {
    type: formData.type,
    iv_input: formatFluidValue(formData.ivInput),
    oral_input: formatFluidValue(formData.oralInput),
    urine_input: formatFluidValue(formData.urineOutput),
    vomits_input: formatFluidValue(formData.vomitusOutput),
    other_input: formData.others || "",
    comment: formData.comments || "",
    admission_id: admissionId,
  };
};

/**
 * Calculate fluid balance statistics
 * @param {Array} entries - Array of fluid balance entries
 * @returns {Object} - Statistics object
 */
export const calculateFluidStats = (entries: FluidEntry[]) => {
  const totalEntries = entries.length;

  const totalInput = entries.reduce(
    (sum, entry) => sum + entry.ivInput + entry.oralInput,
    0
  );

  const totalOutput = entries.reduce(
    (sum, entry) => sum + entry.urineOutput + entry.vomitusOutput,
    0
  );

  const fluidBalance = totalInput - totalOutput;

  const today = new Date().toISOString().split("T")[0];
  const todaysEntries = entries.filter((entry) => entry.date === today).length;

  const typeStats = entries.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonType =
    Object.keys(typeStats).length > 0
      ? Object.keys(typeStats).reduce((a, b) =>
          typeStats[a] > typeStats[b] ? a : b
        )
      : "None";

  return {
    totalEntries,
    totalInput,
    totalOutput,
    fluidBalance,
    todaysEntries,
    mostCommonType,
    typeStats,
  };
};

/**
 * Validate form data before submission
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateFluidBalanceForm = (formData: {
  [x: string]: number | string;
  type: string;
  recordedBy: string;
}) => {
  const errors = [];

  if (!formData.type?.trim()) {
    errors.push("Type is required");
  }

  if (!formData.recordedBy?.trim()) {
    errors.push("Recorded By is required");
  }

  // Validate numeric fields
  const numericFields = [
    "ivInput",
    "oralInput",
    "urineOutput",
    "vomitusOutput",
  ];
  numericFields.forEach((field) => {
    const value = Number(formData[field]);
    if (formData[field] && (isNaN(value) || value < 0)) {
      errors.push(
        `${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} must be a valid number`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
