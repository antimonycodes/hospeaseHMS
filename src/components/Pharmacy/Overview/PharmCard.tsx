import React from "react";
import Table from "../../../Shared/Table";
import { Patient, patients } from "../../../data/patientsData";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

const PharmCard = () => {
  const pendingPatients = patients.filter(
    (patient) => patient.status === "Pending"
  );

  const statusStyles: Record<Patient["status"], string> = {
    Ongoing: "bg-[#FFEBAA] text-[#B58A00]",
    Completed: "bg-[#CFFFE9] text-[#009952]",
    Pending: "bg-[#FBE1E1] text-[#F83E41]",
  };

  const columns: {
    key: keyof Patient;
    label: string;
    render: (value: string | number, row: Patient) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "patientid",
      label: "Patient ID",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(value as string)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            statusStyles[value as Patient["status"]]
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table
        data={pendingPatients.slice(0, 3)}
        columns={columns}
        rowKey="id"
        pagination={false}
        radius="rounded-lg"
      />
    </div>
  );
};

export default PharmCard;
