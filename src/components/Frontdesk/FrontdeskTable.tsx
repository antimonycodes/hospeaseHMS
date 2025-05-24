import { JSX, useEffect } from "react";
import { motion } from "framer-motion";

import Table from "../../Shared/Table";
import Tablehead from "../ReusablepatientD/Tablehead";
import { usePatientStore } from "../../store/super-admin/usePatientStore";
import Loader from "../../Shared/Loader";

type PatientData = {
  name: string;
  age: number;
  gender: string;
  phone: string;
  id: number;
};

const FrontdeskTable = () => {
  const { patients, getAllPatients, isLoading } = usePatientStore();

  // In FrontdeskTable.tsx
  useEffect(() => {
    getAllPatients("1", "20", "/front-desk/patient/fetch");
  }, [getAllPatients]);
  // Transform API data into the correct format
  const formattedPatients: PatientData[] =
    patients?.map((patient: any) => ({
      name: `${patient.attributes.first_name} ${patient.attributes.last_name}`,
      age: patient.attributes.age,
      gender: patient.attributes.gender,
      phone: patient.attributes.phone_number,
      id: patient.id,
    })) || [];

  // Slice the data into 3 sections (displaying only the first 3)
  const displayedPatients = formattedPatients.slice(0, 3);

  const columns: {
    key: keyof PatientData;
    label: string;
    render: (_: any, patient: PatientData) => JSX.Element;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (_: any, patient: PatientData) => (
        <span className="text-[#101828] font-medium text-sm">
          {patient.name}
        </span>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (_: any, patient: PatientData) => (
        <span className="text-[#667085] text-sm">{patient.age}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_: any, patient: PatientData) => (
        <span className="text-[#667085] text-sm">{patient.phone}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_: any, patient: PatientData) => (
        <span className="text-[#667085] text-sm">{patient.gender}</span>
      ),
    },
  ];

  return (
    <div className="w-full h-full  bg-white rounded-[8px] shadow overflow-hidden">
      <Tablehead
        tableTitle="Recent Patients"
        showSearchBar={false}
        showControls={false}
        typebutton="Add New"
      />
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <Table
          data={displayedPatients}
          columns={columns}
          rowKey="id"
          pagination={false}
          radius="rounded-none"
        />
      )}
    </div>
  );
};

export default FrontdeskTable;
