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
  const [prevState, setPrevState] = useState<{
    filters: FilterValues;
    currentPage: number;
    perPage: number;
  }>({
    filters,
    currentPage,
    perPage,
  });
  const [isFetching, setIsFetching] = useState(false);

  const debouncedFilters = useDebounce(filters, 300);

  // Notify parent when filter search changes
  useEffect(() => {
    const isSearchActive = !!debouncedFilters.search;
    console.log("Filter search active (InformationTable):", isSearchActive);
    onFilterSearchChange?.(isSearchActive);
  }, [debouncedFilters.search, onFilterSearchChange]);

  // Sync currentPage with pagination prop
  useEffect(() => {
    if (pagination?.current_page && pagination.current_page !== currentPage) {
      setCurrentPage(pagination.current_page);
    }
  }, [pagination?.current_page]);

  // Sync perPage with pagination prop
  useEffect(() => {
    if (pagination?.per_page && pagination.per_page !== perPage) {
      setPerPage(pagination.per_page);
    }
  }, [pagination?.per_page]);

  // Fetch patients with debounced filters, page, or perPage changes
  useEffect(() => {
    if (!baseEndpoint || isLoading || isFetching) return;
    if (
      areEqual(debouncedFilters, prevState.filters) &&
      currentPage === prevState.currentPage &&
      perPage === prevState.perPage
    ) {
      console.log("Skipping fetch: no changes in filters, page, or perPage");
      return;
    }

    console.log(
      "Fetching with filters:",
      debouncedFilters,
      "page:",
      currentPage,
      "perPage:",
      perPage
    );
    setIsFetching(true);
    filterPatients(
      debouncedFilters,
      currentPage.toString(),
      perPage.toString(),
      baseEndpoint
    )
      .then(() => {
        setPrevState({ filters: debouncedFilters, currentPage, perPage });
      })
      .catch(() => {
        console.error("Fetch failed");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [
    currentPage,
    perPage,
    debouncedFilters,
    baseEndpoint,
    filterPatients,
    isLoading,
    prevState,
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
    console.log("Page changed to:", page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    console.log("Per page changed to:", newPerPage);
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
          // onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default InformationTable;
