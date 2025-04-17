import React, { useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";

const NurseCard = () => {
  const { patients, getAllPatients, isLoading } = usePatientStore();

  // Fetch patients when component mounts
  useEffect(() => {
    getAllPatients("/nurses/all-patients");
  }, [getAllPatients]);

  // Filter for only Pending and Completed patients
  // const filteredPatients = patients.filter((patient) =>
  //   ["Pending", "Completed"].includes(patient.attributes.status)
  // );

  // Define columns matching the UI/UX from the original NurseCard
  const columns: {
    key: string;
    label: string;
    render: (value: any, row: any) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {`${row.attributes.first_name} ${row.attributes.last_name}`}
        </span>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.attributes.age}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(row.attributes.phone_number)}
        </span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.attributes.gender}</span>
      ),
    },
    {
      key: "created_at",
      label: "Last Visit",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.attributes.created_at}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => (
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            row.attributes.status === "Pending"
              ? "bg-[#FBE1E1] text-[#F83E41]"
              : "bg-[#CFFFE9] text-[#009952]"
          }`}
        >
          {row.attributes.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Recent Patients"
        showControls={false}
        showSearchBar={false}
        showButton={false}
        tableCount={patients.length}
      />
      {isLoading ? (
        <div className="p-4 text-gray-500">Loading patients...</div>
      ) : (
        <Table
          data={patients.slice(0, 3)}
          columns={columns}
          rowKey="id"
          // pagination={filteredPatients.length > 5} // Adjust as needed
          radius="rounded-lg"
        />
      )}
    </div>
  );
};

export default NurseCard;
