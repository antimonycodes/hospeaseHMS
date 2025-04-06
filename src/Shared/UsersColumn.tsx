import { JSX } from "react";

interface Patient {
  id: any;
  name: string;
  patientId: string;
  gender: string;
  phone: string;
  occupation: string;
  doctor: string;
  status?: "Pending" | "Accepted" | "Declined" | "Rescheduled" | "Completed";
}

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => JSX.Element;
}

const statusStyles: Record<NonNullable<Patient["status"]>, string> = {
  Pending: "bg-[#FFEBAA] text-[#B58A00]",
  Accepted: "bg-[#CFFFE9] text-[#009952]",
  Declined: "bg-[#FBE1E1] text-[#F83E41]",
  Rescheduled: "bg-[#BED4FF] text-[#101828]",
  Completed: "bg-[#BED4FF] text-[#101828]",
};

export const getUserColumns = (
  details: (patientId: string) => void,
  data: Patient[], // Pass the data to determine which columns to include
  includeStatus?: boolean // Optional flag to include/exclude the status column
): Column<Patient>[] => {
  const baseColumns: Column<Patient>[] = [
    {
      key: "name",
      label: "Name",
      render: (_, data) => (
        <span className="font-medium text-[#101828] text-sm">{data.name}</span>
      ),
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.patientId}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.gender}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.phone}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.occupation}</span>
      ),
    },
    {
      key: "doctor",
      label: "Doctor Assigned",
      render: (_, data) => (
        <span className="text-[#667085] text-sm">{data.doctor}</span>
      ),
    },
  ];

  // Add status column only if includeStatus is true
  if (includeStatus) {
    baseColumns.push({
      key: "status",
      label: "Status",
      render: (status: Patient["status"]) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status ? statusStyles[status] : ""
          }`}
        >
          {status}
        </span>
      ),
    });
  }

  // Add "View more" button column
  baseColumns.push({
    key: "patientId",
    label: "",
    render: (_, data) => (
      <button
        className="cursor-pointer text-[#009952] text-sm font-medium"
        onClick={() => details(data.id)}
      >
        View more
      </button>
    ),
  });

  return baseColumns;
};
