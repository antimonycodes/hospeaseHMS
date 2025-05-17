import React, { useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Shared/Loader";
import { getImageSrc } from "../../../utils/imageUtils";

// Updated interface to match the actual data structure
interface Patient {
  type: string;
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    card_id: string;
    phone_number: string;
    occupation: string;
    gender: string;
    created_at: string;
    [key: string]: any;
  };
}

interface Doctor {
  type: string;
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    phone: string;
    department?: {
      id: number;
      name: string;
    };
    [key: string]: any;
  };
}

interface AppointmentAttributes {
  patient: Patient;
  doctor: Doctor;
  status: string;
  date: string;
  time: string;
  created_at: string;
}

interface AppointmentData {
  type: string;
  id: number;
  attributes: AppointmentAttributes;
}

interface ApiResponse {
  status: boolean;
  message: string;
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
  status_code: number;
}

type TableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

const formatStatus = (
  status: string
): "Pending" | "Accepted" | "Rescheduled" | "Completed" => {
  const statusMap: Record<
    string,
    "Pending" | "Accepted" | "Rescheduled" | "Completed"
  > = {
    pending: "Pending",
    approved: "Accepted",
    accepted: "Accepted",
    rejected: "Completed",
    declined: "Completed",
    rescheduled: "Rescheduled",
    reschedule: "Rescheduled",
  };

  return statusMap[status.toLowerCase()] || "Pending";
};

const tabs = ["Pending", "Accepted", "Rescheduled", "Completed"] as const;
type TabType = (typeof tabs)[number];

type FlattenedAppointment = {
  id: number;
  type: string;
  patientName: string;
  doctorName: string;
  status: "Pending" | "Accepted" | "Rescheduled" | "Completed" | undefined;
  gender: string;
  phoneNumber: string;
  occupation: string;
  date: string;
  time: string;
  created_at: string;
  department?: string;
  patientId?: string;
};

const MedAppointment = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const { appointments, isLoading, getAllAppointments } = usePatientStore();
  const navigate = useNavigate();
  const baseEndpoint = "/medical-director/my-appointments";

  useEffect(() => {
    getAllAppointments("1", "10", baseEndpoint);
  }, [getAllAppointments]);

  // Safely extract appointments data
  const appointmentsData =
    appointments &&
    typeof appointments === "object" &&
    "data" in appointments &&
    Array.isArray((appointments as any).data)
      ? (appointments as { data: AppointmentData[] }).data
      : Array.isArray(appointments)
      ? appointments
      : [];

  const flattenAppointments = (
    data: AppointmentData[]
  ): FlattenedAppointment[] => {
    if (!Array.isArray(data)) return [];

    return data.map((appointment) => {
      const patient = appointment.attributes.patient;
      const doctor = appointment.attributes.doctor;
      const rawStatus = appointment.attributes.status.toLowerCase();
      let status: FlattenedAppointment["status"];

      switch (rawStatus) {
        case "pending":
          status = "Pending";
          break;
        case "accepted":
          status = "Accepted";
          break;
        case "reschedule":
        case "rescheduled":
          status = "Rescheduled";
          break;
        case "completed":
        case "rejected":
        case "declined":
          status = "Completed";
          break;
        default:
          status = undefined;
      }

      return {
        id: appointment.id,
        type: appointment.type,
        patientName: `${patient.attributes?.first_name} ${patient.attributes.last_name}`,
        doctorName: `${doctor.attributes.first_name} ${doctor.attributes.last_name}`,
        status: formatStatus(appointment.attributes.status),
        gender: patient.attributes.gender || "N/A",
        phoneNumber: patient.attributes.phone_number || "N/A",
        occupation: patient.attributes.occupation || "N/A",
        date: appointment.attributes.date,
        time: appointment.attributes.time,
        created_at: appointment.attributes.created_at,
        department: doctor.attributes.department?.name,
        patientId: patient.attributes.card_id,
      };
    });
  };

  const statusStyles: Record<string, string> = {
    Pending: "bg-[#FFEBAA] text-[#B58A00]",
    Accepted: "bg-[#CFFFE9] text-[#009952]",
    Declined: "bg-[#FBE1E1] text-[#F83E41]",
    Rescheduled: "bg-[#BED4FF] text-[#101828]",
  };

  const handleViewMore = (id: number) => {
    console.log("Navigating to appointment details for ID:", id);
    // navigate(`/dashboard/appointment/medical-director/${id}`);
    navigate(`/dashboard/appointment/doctor/${id}`);
  };

  if (!appointments) return <Loader />;
  const columns: TableColumn<FlattenedAppointment>[] = [
    {
      key: "patientName",
      label: "Name",
      render: (_, data) => (
        <span className="font-medium text-[#101828]">{data.patientName}</span>
      ),
    },
    // {
    //   key: "id",
    //   label: "Appointment ID",
    //   render: (_, data) => (
    //     <span className="text-[#667085]">
    //       #{data.id.toString().padStart(6, "0")}
    //     </span>
    //   ),
    // },
    {
      key: "gender",
      label: "Gender",
      render: (_, data) => (
        <span className="text-[#667085]">
          {data.gender
            ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1)
            : "N/A"}
        </span>
      ),
    },
    {
      key: "phoneNumber",
      label: "Phone",
      render: (_, data) => (
        <span className="text-[#667085]">{data.phoneNumber}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, data) => (
        <span className="text-[#667085]">{data.occupation}</span>
      ),
    },
    {
      key: "doctorName",
      label: "Assigned To",
      render: (_, data) => {
        const assignedTo =
          data.doctorName ||
          (data.department ? `${data.department} department` : "N/A");
        return <span className="text-[#667085]">{assignedTo}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (_, attributes) => {
        const displayStatus = formatStatus(attributes.status ?? "");
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[displayStatus]}`}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (_, data) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => handleViewMore(data.id)}
        >
          View More
        </span>
      ),
    },
  ];

  const getStatusCounts = () => {
    if (!Array.isArray(appointmentsData) || appointmentsData.length === 0) {
      return {
        Pending: 0,
        Accepted: 0,
        Rescheduled: 0,
        Completed: 0,
      } as Record<TabType, number>;
    }

    return appointmentsData.reduce(
      (acc, appointment) => {
        const status = formatStatus(appointment.attributes.status ?? "");
        acc[status]++;
        return acc;
      },
      {
        Pending: 0,
        Accepted: 0,
        Rescheduled: 0,
        Completed: 0,
      } as Record<TabType, number>
    );
  };

  const statusCounts = getStatusCounts();

  const filteredAppointments = Array.isArray(appointmentsData)
    ? appointmentsData.filter(
        (a: AppointmentData) =>
          formatStatus(a.attributes.status ?? "") === activeTab
      )
    : [];

  const flattenedAppointments = flattenAppointments(filteredAppointments);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full bg-white rounded-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px] font-medium">
          Appointments{" "}
          <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
            {Array.isArray(appointmentsData) ? appointmentsData.length : 0}
          </span>
        </h1>

        <div className="flex w-full items-center gap-2 border border-gray-200 py-2 px-4 rounded-[10px] md:w-[70%]">
          <img src={getImageSrc("search.svg")} alt="" />
          <input
            type="search"
            placeholder="Type to search"
            className="outline-none font-medium placeholder:text-xs text-xs"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="cursor-pointer">
            <img src={getImageSrc("filter.svg")} alt="Filter" />
          </button>
        </div>
      </div>

      <div className="px-4 w-full flex space-x-2 md:space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 flex items-center gap-2 text-xs md:text-sm font-medium cursor-pointer ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-[#667185]"
            }`}
          >
            {tab}
            {statusCounts[tab] > 0 && (
              <span className="text-xs bg-primary text-white py-0.5 px-3 rounded-xl">
                {statusCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {flattenedAppointments.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">
          No appointments found
        </div>
      ) : (
        <Table
          columns={columns}
          data={flattenedAppointments}
          rowKey="id"
          pagination={true}
          paginationData={
            appointments &&
            typeof appointments === "object" &&
            "pagination" in appointments
              ? (appointments as { pagination: any }).pagination
              : null
          }
        />
      )}
    </div>
  );
};

export default MedAppointment;
