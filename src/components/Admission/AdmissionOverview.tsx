import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  User,
  Bed,
  AlertTriangle,
  Clock,
  Eye,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useAdmissionStore } from "../../store/super-admin/useAdmissionStore";
import Loader from "../../Shared/Loader";
import Table from "../../Shared/Table";
import { useNavigate } from "react-router-dom";

interface NextOfKin {
  [key: string]: any;
}

interface ClinicalDepartment {
  id: number;
  name: string;
}

interface RecommendedBy {
  id: number;
  first_name: string;
  last_name: string;
}

interface PatientAttributes {
  first_name: string;
  last_name: string;
  branch: string;
  card_id: string;
  phone_number: string;
  occupation: string;
  religion: string;
  card_type: string | null;
  gender: string;
  address: string;
  is_admitted: boolean;
  patient_type: string;
  clinical_department: ClinicalDepartment;
  age: number;
  next_of_kin: NextOfKin[];
  created_at: string;
}

interface Patient {
  type: string;
  id: number;
  attributes: PatientAttributes;
}

interface AdmissionAttributes {
  bed_number: string;
  status: string;
  diagnosis: string;
  clinical_department: ClinicalDepartment;
  recommended_by: RecommendedBy;
  recorded_by: RecommendedBy;
  created_at: string;
  updated_at: string;
}

interface AdmissionRecord {
  type: string;
  id: number;
  attributes: AdmissionAttributes & {
    patient: Patient;
    recovery_history: any[];
    fluid_balance: any[];
    medication_history: any[];
    tpr_history: any[];
    vital_signs_history: any[];
  };
}

// Table data types
type AdmissionTableData = {
  id: number;
  name: string;
  patientId: string;
  gender: string;
  bedNumber: string;
  ward: string;
  diagnosis: string;
  status: string;
  totalStay: string;
  actions?: string;
};

type Column = {
  key: keyof AdmissionTableData;
  label: string;
  render?: (value: any, row: AdmissionTableData) => React.ReactNode;
};

// API Response structure
interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: AdmissionRecord[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
    };
  };
  status_code: number;
}

const AdmissionOverview: React.FC = () => {
  const { admissionList, isLoading, allAdmission } = useAdmissionStore();
  // const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"admitted" | "discharged">(
    "admitted"
  );
  const [filteredPatients, setFilteredPatients] = useState<AdmissionRecord[]>(
    []
  );
  const [formattedAdmissions, setFormattedAdmissions] = useState<
    AdmissionTableData[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admission data on component mount
    allAdmission();
  }, [allAdmission]);

  useEffect(() => {
    // Filter patients based on tab and search term
    let tabFilteredPatients = admissionList;

    // Filter by tab first
    if (activeTab === "discharged") {
      tabFilteredPatients = admissionList.filter(
        (admission) =>
          admission.attributes.status.toLowerCase() === "discharged"
      );
    } else {
      tabFilteredPatients = admissionList.filter(
        (admission) =>
          admission.attributes.status.toLowerCase() !== "discharged"
      );
    }

    // Then filter by search term
    if (searchTerm.trim() === "") {
      setFilteredPatients(tabFilteredPatients);
    } else {
      const filtered = tabFilteredPatients.filter((admission) => {
        const patientName =
          `${admission.attributes.patient.attributes.first_name} ${admission.attributes.patient.attributes.last_name}`.toLowerCase();
        const patientId =
          admission.attributes.patient.attributes.card_id.toLowerCase();
        const diagnosis = admission.attributes.diagnosis.toLowerCase();
        const ward =
          admission.attributes.clinical_department.name.toLowerCase();

        return (
          patientName.includes(searchTerm.toLowerCase()) ||
          patientId.includes(searchTerm.toLowerCase()) ||
          diagnosis.includes(searchTerm.toLowerCase()) ||
          ward.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredPatients(filtered);
    }
  }, [admissionList, searchTerm, activeTab]);

  // Format admissions for table
  useEffect(() => {
    const formatted = filteredPatients.map((admission) => ({
      id: admission.id,
      name: `${capitalizeFirst(
        admission.attributes.patient.attributes.first_name
      )} ${capitalizeFirst(admission.attributes.patient.attributes.last_name)}`,
      patientId: admission.attributes.patient.attributes.card_id,
      gender: capitalizeFirst(admission.attributes.patient.attributes.gender),
      bedNumber: admission.attributes.bed_number,
      ward: admission.attributes.clinical_department.name,
      diagnosis: admission.attributes.diagnosis,
      status: admission.attributes.status,
      totalStay: `${formatDate(admission.attributes.created_at)} days`,
    }));
    setFormattedAdmissions(formatted);
  }, [filteredPatients]);

  // Calculate statistics from the actual data
  const totalPatients = admissionList.length;
  const admittedPatients = admissionList.filter(
    (admission) => admission.attributes.status.toLowerCase() !== "discharged"
  ).length;
  const dischargedPatients = admissionList.filter(
    (admission) => admission.attributes.status.toLowerCase() === "discharged"
  ).length;
  const criticalCases = admissionList.filter((admission) =>
    admission.attributes.status.toLowerCase().includes("critical")
  ).length;
  const occupiedBeds = admissionList.filter(
    (admission) => admission.attributes.patient.attributes.is_admitted
  ).length;

  // Calculate average stay (this would need more data from backend for accurate calculation)
  const averageStay = "N/A"; // You'll need admission date vs current date calculation

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
  }> = ({ title, value, icon, bgColor, iconColor }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    let statusClasses = "";

    if (status.toLowerCase().includes("critical")) {
      statusClasses = "bg-red-100 text-red-700";
    } else if (status.toLowerCase() === "discharged") {
      statusClasses = "bg-gray-100 text-gray-700";
    } else if (status.toLowerCase().includes("ready for discharge")) {
      statusClasses = "bg-yellow-100 text-yellow-700";
    } else {
      statusClasses = "bg-green-100 text-green-700";
    }

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
  };

  const TabButton: React.FC<{
    tab: "admitted" | "discharged";
    label: string;
    count: number;
  }> = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? " text-primary border border-primary"
          : "text-gray-600 "
      }`}
    >
      {label} ({count})
    </button>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Handle row click navigation
  const handleRowClick = (admission: AdmissionTableData) => {
    navigate(`/dashboard/admission-details/${admission.id}`);
    // console.log("Navigate to:", `/dashboard/admission-details/${admission.id}`);
  };

  // Handle view more action
  const handleViewMore = (
    admission: AdmissionTableData,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent row click when clicking the button
    navigate(`/dashboard/admission-details/${admission.id}`);
    // console.log("View more for patient:", admission.id);
  };

  // Handle page change (if you implement pagination later)
  const handlePageChange = (page: number) => {
    // Implement pagination logic here when needed
    console.log("Page changed to:", page);
  };

  // Table columns configuration
  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      render: (_, row) => (
        <span className="font-medium text-[#101828]">{row.name}</span>
      ),
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.patientId}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.gender}</span>
      ),
    },
    {
      key: "bedNumber",
      label: "Bed Number",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.bedNumber}</span>
      ),
    },
    {
      key: "ward",
      label: "Ward",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.ward}</span>
      ),
    },
    {
      key: "diagnosis",
      label: "Diagnosis",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.diagnosis}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => <StatusBadge status={row.status} />,
    },
    {
      key: "totalStay",
      label: "Total Stay (Days)",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.totalStay}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={(e) => handleViewMore(row, e)}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-primary  rounded-md transition-colors"
        >
          {/* <Eye size={14} /> */}
          View More
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          {/* <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Good Morning! Doctor Abiola
          </h1> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="TOTAL PATIENTS"
            value={admittedPatients}
            icon={<User size={24} />}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="OCCUPIED BEDS"
            value={occupiedBeds}
            icon={<Bed size={24} />}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="CRITICAL CASES"
            value={criticalCases}
            icon={<AlertTriangle size={24} />}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="AVERAGE STAY (DAYS)"
            value={averageStay}
            icon={<Clock size={24} />}
            bgColor="bg-pink-100"
            iconColor="text-pink-600"
          />
        </div>

        {/* Patients Table with Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient Admissions
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Type to search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2">
              <TabButton
                tab="admitted"
                label="Admitted"
                count={admittedPatients}
              />
              <TabButton
                tab="discharged"
                label="Discharged"
                count={dischargedPatients}
              />
            </div>
          </div>

          {/* Use the Table component */}
          <div className="overflow-hidden">
            <Table
              data={formattedAdmissions}
              columns={columns}
              rowKey="id"
              pagination={false} // Set to true when you implement pagination
              paginationData={null} // Add pagination data when needed
              loading={isLoading}
              onPageChange={handlePageChange}
              clickableRows={true}
              onRowClick={handleRowClick}
              radius="rounded-none" // Remove border radius since parent has it
              emptyMessage={
                searchTerm
                  ? `No ${activeTab} patients found matching your search.`
                  : `No ${activeTab} records found.`
              }
            />
          </div>

          {/* Custom pagination footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {formattedAdmissions.length} of{" "}
                {activeTab === "admitted"
                  ? admittedPatients
                  : dischargedPatients}{" "}
                {activeTab} results
              </p>
              {/* Add pagination controls here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionOverview;
