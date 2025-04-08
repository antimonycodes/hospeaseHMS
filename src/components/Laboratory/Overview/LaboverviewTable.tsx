import React, { JSX, useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

type LabPatient = {
  id: number;
  name: string;
  patientid: string;
  phone: string;
  gender: string;
  status: "Pending" | "Ongoing" | "Completed";
};

type Columns = {
  key: keyof LabPatient;
  label: string;
  render?: (value: any, patient: LabPatient) => JSX.Element;
};

const LaboverviewTable = () => {
  const { labPatients, getLabPatients, isLoading } = usePatientStore();

  useEffect(() => {
    getLabPatients();
  }, [getLabPatients]);

  // Filter patients by status
  const pendingPatients = labPatients.filter(
    (patient) => patient.status === "Pending"
  );

  const ongoingPatients = labPatients.filter(
    (patient) => patient.status === "Ongoing"
  );

  const statusStyles: Record<string, string> = {
    Ongoing: "bg-[#FFEBAA] text-[#B58A00]",
    Completed: "bg-[#CFFFE9] text-[#009952]",
    Pending: "bg-[#FBE1E1] text-[#F83E41]",
  };

  const columns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (value: string) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            statusStyles[value] || "bg-gray-200 text-gray-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const detailedColumns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (value: string) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "patientid",
      label: "Patient ID",
      render: (value: string) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value: string) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(value)}
        </span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (value: string) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full text-center py-4">
        Loading laboratory patients...
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4">
      {/* Pending Tests */}
      <div className="w-1/2">
        <Tablehead
          showSearchBar={false}
          typebutton="Add New"
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
          typebutton="Add New"
          tableTitle="Ongoing Tests"
          tableCount={ongoingPatients.length}
          showControls={false}
          showSearchBar={false}
        />
        <div>
          <Table
            data={ongoingPatients.slice(0, 3)}
            columns={detailedColumns}
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
