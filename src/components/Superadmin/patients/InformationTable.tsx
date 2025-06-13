import { JSX, useEffect, useMemo, useState } from "react";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";
import PatientTableFilters, { FilterValues } from "./PatientTableFilters";

// Utility for deep equality comparison
function areEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

type InformationData = {
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  viewMore: string;
  id: number;
};

type Columns = {
  key: keyof InformationData | "viewMore";
  label: string;
  render?: (value: any, patient: InformationData) => JSX.Element;
};

type InformationTableProps = {
  patients: {
    attributes: {
      first_name: string;
      last_name: string;
      age: number;
      gender: string;
      phone_number: string;
      branch: string;
      occupation: string;
      card_id: string;
      patient_category?: {
        id: number;
        name: string;
      } | null;
    };
    id: number;
  }[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null;
  isLoading: boolean;
  baseEndpoint?: string;
  patientCategories?: { id: number; name: string }[];
  onFilterSearchChange?: (isActive: boolean) => void;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const InformationTable = ({
  patients,
  pagination,
  isLoading,
  baseEndpoint = "/admin/patient/fetch",
  patientCategories = [],
  onFilterSearchChange,
}: InformationTableProps) => {
  const navigate = useNavigate();
  const { filterPatients } = usePatientStore();
  const [currentPage, setCurrentPage] = useState(pagination?.current_page || 1);
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    patient_category_id: "",
    branch: "",
    gender: "",
    occupation: "",
    age_from: "",
    age_to: "",
  });
  const [prevFilters, setPrevFilters] = useState<FilterValues>(filters);

  const debouncedFilters = useDebounce(filters, 300);

  // Notify parent when filter search changes
  useEffect(() => {
    onFilterSearchChange?.(!!debouncedFilters.search);
  }, [debouncedFilters.search, onFilterSearchChange]);

  // Reset currentPage when pagination prop changes
  useEffect(() => {
    if (pagination?.current_page && pagination.current_page !== currentPage) {
      setCurrentPage(pagination.current_page);
    }
  }, [pagination?.current_page]);

  // Fetch patients with debounced filters
  useEffect(() => {
    if (!baseEndpoint || isLoading) return;
    if (areEqual(debouncedFilters, prevFilters)) return;
    console.log("Fetching with filters:", debouncedFilters);
    filterPatients(
      debouncedFilters,
      currentPage.toString(),
      perPage.toString(),
      baseEndpoint
    );
    setPrevFilters(debouncedFilters);
  }, [
    currentPage,
    perPage,
    debouncedFilters,
    baseEndpoint,
    filterPatients,
    isLoading,
    prevFilters,
  ]);

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    if (!Array.isArray(patients)) {
      return {
        branches: [] as string[],
        genders: [] as string[],
        occupations: [] as string[],
        categories: [] as { id: number; name: string }[],
      };
    }
    const branches = Array.from(
      new Set(
        patients.map((patient) => patient.attributes?.branch).filter(Boolean)
      )
    ) as string[];
    const genders = Array.from(
      new Set(
        patients.map((patient) => patient.attributes?.gender).filter(Boolean)
      )
    ) as string[];
    const occupations = Array.from(
      new Set(
        patients
          .map((patient) => patient.attributes?.occupation)
          .filter(Boolean)
      )
    ) as string[];
    const categoriesFromPatients = patients
      .map((patient) => patient.attributes?.patient_category)
      .filter(
        (category): category is { id: number; name: string } =>
          category !== null && category !== undefined
      );
    const uniqueCategories = categoriesFromPatients.filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.id === category.id)
    );
    const allCategories = [...patientCategories, ...uniqueCategories];
    const finalCategories = allCategories.filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.id === category.id)
    );
    return {
      branches,
      genders,
      occupations,
      categories: finalCategories,
    };
  }, [patients, patientCategories]);

  const formattedPatients = useMemo(
    () =>
      patients.map((patient) => ({
        name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
        patientId: patient.attributes.card_id,
        age: patient.attributes.age || 0,
        gender: patient.attributes.gender || "",
        phone: patient.attributes.phone_number || "",
        branch: patient.attributes.branch || "",
        occupation: patient.attributes.occupation || "",
        viewMore: "View More",
        id: patient.id,
      })),
    [patients]
  );

  const handleViewMore = (id: string) => {
    navigate(`/dashboard/patients/${id}`);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    console.log("Filter change:", newFilters);
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  if (isLoading && !patients.length) return <Loader />;

  const columns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (_, patient) => <div>{patient.name}</div>,
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, patient) => <div>{patient.patientId}</div>,
    },
    {
      key: "age",
      label: "Age",
      render: (_, patient) => <div>{patient.age}</div>,
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, patient) => <div>{patient.gender}</div>,
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, patient) => <div>{patient.phone}</div>,
    },
    {
      key: "branch",
      label: "Branch",
      render: (_, patient) => <div>{patient.branch}</div>,
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, patient) => <div>{patient.occupation}</div>,
    },
    {
      key: "viewMore",
      label: "",
      render: (_, patient) => (
        <button
          className="text-primary font-medium"
          onClick={() => handleViewMore(patient.id.toString())}
        >
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <PatientTableFilters
        onFilterChange={handleFilterChange}
        patientCategories={filterOptions.categories}
        branches={filterOptions.branches.map((branch, idx) => ({
          id: idx,
          name: branch,
        }))}
        genders={filterOptions.genders}
        occupations={filterOptions.occupations}
        isLoading={isLoading}
      />
      {!formattedPatients.length ? (
        <div className="mt-10 text-center text-gray-500">
          {isLoading ? "Loading patients..." : "No patients found"}
        </div>
      ) : (
        <Table
          columns={columns}
          data={formattedPatients}
          rowKey="id"
          pagination={true}
          paginationData={pagination}
          loading={isLoading}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default InformationTable;
