import React from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import { Patient, patients } from "../../../data/patientsData";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

const MatronCard = () => {
  const columns: {
    key: keyof Patient;
    label: string;
    render: (value: string | number, row: Patient) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "Name ",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "age",
      label: "Age",
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
    {
      key: "lastVisit",
      label: "Last visit",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];
  return (
    <div>
      <Tablehead
        tableTitle="Recent Patients"
        showControls={false}
        showSearchBar={false}
        showButton={false}
      />
      <Table
        data={patients.slice(0, 3)}
        columns={columns}
        rowKey="id"
        pagination={false}
        radius="rounded-lg"
      />
    </div>
  );
};

export default MatronCard;
