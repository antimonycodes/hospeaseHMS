import React from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { patients, Patient } from "../../../data/patientsData";
import Table from "../../../Shared/Table";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

const LaboverviewTable = () => {
  const pendingPatients = patients.filter(
    (patient) => patient.status === "Pending"
  );
  const ongoingPatients = patients.filter(
    (patient) => patient.status === "Ongoing"
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

  const columnss: {
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
        <span className="text-[#667085] text-sm">{value}</span>
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
      key: "gender",
      label: "Gender",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div className="w-full flex    gap-4">
      {/* Pending Tests */}
      <div className="w-1/2">
        <Tablehead
          showSearchBar={false}
          tableTitle="Pending Tests"
          tableCount={pendingPatients.length}
          showControls={false}
        />
        <div>
          <Table
            data={pendingPatients.slice(0, 3)}
            columns={columns}
            rowKey="id"
            pagination={false}
            radius="rounded-none"
          />
        </div>
      </div>

      {/* Ongoing Tests */}
      <div className="flex-grow">
        <Tablehead
          tableTitle="Ongoing Tests"
          tableCount={ongoingPatients.length}
          showControls={false}
          showSearchBar={false}
        />
        <div>
          <Table
            data={ongoingPatients.slice(0, 3)}
            columns={columnss}
            rowKey="id"
            pagination={false}
            radius="rounded-none"
          />
        </div>
      </div>
    </div>
  );
};

export default LaboverviewTable;
