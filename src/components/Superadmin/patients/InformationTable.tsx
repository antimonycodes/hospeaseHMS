import { JSX, useEffect, useMemo, useState } from "react";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";
import PatientTableFilters, { FilterValues } from "./PatientTableFilters";

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
};

const InformationTable = ({
  patients,
  isLoading,
  pagination,
  baseEndpoint = "/admin/patient/fetch",
  patientCategories = [],
}: InformationTableProps) => {
  const navigate = useNavigate();
  const { getAllPatients } = usePatientStore();
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

  // Add state to track if we're in the middle of a filter operation
  const [isFiltering, setIsFiltering] = useState(false);

  // Extract unique values for filters using useMemo
  const filterOptions = useMemo(() => {
    if (!Array.isArray(patients)) {
      return {
        branches: [] as any[],
        genders: [] as string[],
        occupations: [] as string[],
        categories: [] as { id: number; name: string }[],
      };
    }

    // Extract unique branches
    const branches = Array.from(
      new Set(
        patients.map((patient) => patient.attributes?.branch).filter(Boolean)
      )
    ) as string[];

    // Extract unique genders
    const genders = Array.from(
      new Set(
        patients.map((patient) => patient.attributes?.gender).filter(Boolean)
      )
    ) as string[];

    // Extract unique occupations
    const occupations = Array.from(
      new Set(
        patients
          .map((patient) => patient.attributes?.occupation)
          .filter(Boolean)
      )
    ) as string[];

    // Extract unique patient categories from the patients data
    const categoriesFromPatients = patients
      .map((patient) => patient.attributes?.patient_category)
      .filter(
        (category): category is { id: number; name: string } =>
          category !== null && category !== undefined
      );

    // Remove duplicates based on id
    const uniqueCategories = categoriesFromPatients.filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.id === category.id)
    );

    // Combine with patientCategories prop (if any) and remove duplicates
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

  // Fetch patients with all active filters
  useEffect(() => {
    // Skip if there's no endpoint
    if (!baseEndpoint) {
      return;
    }

    // Skip if already loading to prevent multiple simultaneous requests
    if (isLoading && patients.length === 0) {
      return;
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.toString());
    queryParams.append("per_page", perPage.toString());

    // Add filter values to query - only add non-empty values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    // Create the endpoint with query parameters
    const endpoint = `${baseEndpoint}?${queryParams.toString()}`;

    // Fetch data with current filters
    getAllPatients(currentPage.toString(), perPage.toString(), endpoint);

    // After fetching, reset the filtering flag
    if (isFiltering) {
      setIsFiltering(false);
    }
  }, [currentPage, perPage, filters, baseEndpoint, isFiltering]);

  const handleViewMore = (id: string) => {
    navigate(`/dashboard/patients/${id}`);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    setFilters(newFilters);
    // Set the filtering flag to true to trigger data fetch
    setIsFiltering(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
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
        branches={filterOptions.branches}
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
          // onPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default InformationTable;
