import { JSX, useEffect, useMemo, useState } from "react";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

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
};

const InformationTable = ({ patients, pagination }: InformationTableProps) => {
  const navigate = useNavigate();
  const { getAllPatients } = usePatientStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [lastKnownPagination, setLastKnownPagination] = useState<{
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null>(null);

  // Debug: Log current pagination state
  useEffect(() => {
    console.log("Current pagination:", pagination);
    console.log("Current page state:", currentPage);
  }, [pagination, currentPage]);

  // Store pagination data whenever it's available
  useEffect(() => {
    if (pagination) {
      setLastKnownPagination(pagination);
      // Convert backend page to UI page consistently
      setCurrentPage(pagination.current_page);
    }
  }, [pagination]);

  // Handle page change
  const handlePageChange = async (page: number) => {
    console.log("Page change requested:", page);

    const paginationInfo = pagination || lastKnownPagination;
    // Don't allow navigating past the last page or before the first page
    if (!paginationInfo || page < 1 || page > paginationInfo.last_page + 1) {
      return;
    }

    // Update UI page
    setCurrentPage(page);
    // Convert UI page to backend page (0-based)
    await getAllPatients(page - 1);
  };

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

  // Determine whether to show pagination and what values to use
  const paginationInfo = pagination || lastKnownPagination;
  const showPagination =
    !!paginationInfo &&
    (paginationInfo.last_page > 0 ||
      paginationInfo.total > paginationInfo.per_page);

  // Calculate total pages for display (adding 1 to account for 0-based pagination)
  const totalPages = paginationInfo ? paginationInfo.last_page + 1 : 1;

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={formattedPatients}
        rowKey="id"
        pagination={showPagination}
        rowsPerPage={paginationInfo?.per_page || 10}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InformationTable;
