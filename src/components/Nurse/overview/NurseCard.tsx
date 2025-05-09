import React, { useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Loader from "../../../Shared/Loader";

const NurseCard = () => {
  const { patients, getAllPatients, isLoading, pagination } = usePatientStore();

  const baseEndpoint = "/nurses/all-patients";

  useEffect(() => {
    getAllPatients("1", "10", baseEndpoint);
  }, [getAllPatients]);

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
          {row.attributes.phone_number}
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
        <div>
          <Loader />
        </div>
      ) : (
        <Table
          data={patients.slice(0, 3)}
          columns={columns}
          rowKey="id"
          pagination={pagination !== null}
        />
      )}
    </div>
  );
};

export default NurseCard;
