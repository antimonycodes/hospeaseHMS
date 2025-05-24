import { JSX, useEffect, useMemo, useState } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import { useNavigate } from "react-router-dom";

type AppointmentData = {
  id: number;
  attributes: {
    doctor: string;
    card_id?: string;
    status: string;
    rescheduled_data: any | null;
    doctor_contact: string | null;
    gender: string;
    patient_contact: string;
    occupation: string;
    patient: string;
    date: string;
    time: string;
    reason_if_rejected_or_rescheduled: string | null;
    assigned_by: string;
    created_at: string;
    responded_at: string | null;
    department?: {
      id: number;
      name: string;
    };
  };
};

type AppointmentAttributes = AppointmentData["attributes"];

type Columns = {
  key: keyof AppointmentAttributes | "viewMore";
  label: string;
  render?: (value: any, data: AppointmentAttributes) => JSX.Element;
};

type AppointmentTableProps = {
  data: {
    data: AppointmentData[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
  isLoading: boolean;
  endpoint: string;
};

const formatStatus = (
  status: string
): "Pending" | "Accepted" | "Declined" | "Rescheduled" => {
  const statusMap: Record<
    string,
    "Pending" | "Accepted" | "Declined" | "Rescheduled"
  > = {
    pending: "Pending",
    approved: "Accepted",
    accepted: "Accepted",
    rejected: "Declined",
    declined: "Declined",
    rescheduled: "Rescheduled",
    reschedule: "Rescheduled",
  };
  return statusMap[status.toLowerCase()] || "Pending";
};

const statusStyles: Record<string, string> = {
  Pending: "bg-[#FFEBAA] text-[#B58A00]",
  Accepted: "bg-[#CFFFE9] text-[#009952]",
  Declined: "bg-[#FBE1E1] text-[#F83E41]",
  Rescheduled: "bg-[#BED4FF] text-[#101828]",
};

const tabs = ["All", "Pending", "Accepted", "Declined", "Rescheduled"] as const;
type TabType = (typeof tabs)[number];

const AppointmentDetails = ({
  data,
  isLoading,
  endpoint,
}: AppointmentTableProps) => {
  const { getAllAppointments } = usePatientStore();
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [perPage, setPerPage] = useState(data?.pagination?.per_page || 10);

  // const navigate = useNavigate();

  // const handleViewMore = (id: string) => {
  //   console.log("Navigating to patient ID:", id);
  //   navigate(`/dashboard/appointment/frontdesk/${id}`);
  // };

  console.log(data, "sdf");

  const columns: Columns[] = [
    {
      key: "patient",
      label: "Name",
      render: (_, attributes) => (
        <span className="font-medium text-[#101828]">{attributes.patient}</span>
      ),
    },
    // {
    //   key: "card_id",
    //   label: "Patient ID",
    //   render: (_, attributes) => (
    //     <span className="font-medium text-[#101828]">
    //       {attributes.card_id || "N/A"}
    //     </span>
    //   ),
    // },
    {
      key: "gender",
      label: "Gender",
      render: (_, attributes) => (
        <span className="text-[#667085]">
          {attributes.gender
            ? attributes.gender.charAt(0).toUpperCase() +
              attributes.gender.slice(1)
            : "N/A"}
        </span>
      ),
    },
    {
      key: "patient_contact",
      label: "Phone",
      render: (_, attributes) => (
        <span className="text-[#667085]">
          {attributes.patient_contact || "N/A"}
        </span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, attributes) => (
        <span className="text-[#667085]">{attributes.occupation || "N/A"}</span>
      ),
    },
    {
      key: "doctor",
      label: "Assigned To",
      render: (_, attributes) => {
        // Check if there's a doctor property or department property
        const doctorName =
          attributes.doctor ||
          (attributes.department?.name === "Doctor"
            ? "Assigned to Doctor Dept"
            : attributes.department?.name
            ? `Assigned to ${attributes.department.name} Dept`
            : "N/A");

        return <span className="text-[#667085]">{doctorName}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (_, attributes) => {
        const displayStatus = formatStatus(attributes.status);
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[displayStatus]}`}
          >
            {displayStatus}
          </span>
        );
      },
    },
    // {
    //   key: "viewMore",
    //   label: "",
    //   render: (_, attributes) => (
    //     <span
    //       className="text-primary text-sm font-medium cursor-pointer"
    //       onClick={() => handleViewMore(attributes.id)}
    //     >
    //       View More
    //     </span>
    //   ),
    // },
  ];
  // appointment/frontdesk/:id

  const handlePageChange = (page: number) => {
    getAllAppointments(page.toString(), perPage.toString());
  };

  const appointmentData = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const statusCounts = useMemo(() => {
    if (!Array.isArray(appointmentData)) {
      return {
        All: 0,
        Pending: 0,
        Accepted: 0,
        Declined: 0,
        Rescheduled: 0,
      } as Record<TabType, number>;
    }

    return appointmentData.reduce(
      (acc, item) => {
        const status = formatStatus(item.attributes.status);
        acc[status]++;
        acc.All++;
        return acc;
      },
      {
        All: 0,
        Pending: 0,
        Accepted: 0,
        Declined: 0,
        Rescheduled: 0,
      } as Record<TabType, number>
    );
  }, [appointmentData]);

  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointmentData)) return [];

    return activeTab === "All"
      ? appointmentData
      : appointmentData.filter(
          (a) => formatStatus(a.attributes.status) === activeTab
        );
  }, [appointmentData, activeTab]);

  // Map data to attributes for the Table component
  const tableData = filteredAppointments.map((item) => item.attributes);

  return (
    <div>
      {isLoading && (!appointmentData || appointmentData.length === 0) ? (
        <Loader />
      ) : (
        <div className="w-full bg-white">
          <div className="flex space-x-0.5 md:space-x-6 overflow-x-auto whitespace-nowrap ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-0.5 md:px-4 text-xs md:text-sm font-medium ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
              >
                {tab}
                <span
                  className={`text-xs py-0.5 px-3 rounded-xl ml-2 ${
                    activeTab === tab
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {statusCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {tableData.length === 0 ? (
            <div className="mt-10 text-center text-gray-500">
              No appointments found
            </div>
          ) : (
            <Table
              columns={columns}
              data={tableData}
              rowKey="id"
              pagination={true}
              paginationData={data?.pagination || null}
              loading={isLoading}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
