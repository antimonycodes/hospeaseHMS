import { JSX, useState } from "react";
import Table from "../../../Shared/Table";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { getImageSrc } from "../../../utils/imageUtils";
import AddPatientModal from "./AddPatientModal";
import { Patient, patients } from "../../../data/patientsData";
import Tablehead from "../../ReusablepatientD/Tablehead";

const FpatientsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const columns: {
    key: keyof Patient;
    label: string;
    render?: (value: any, patient: Patient) => JSX.Element;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (_, patient) => (
        <span className=" text-dark font-medium text-sm">{patient.name}</span>
      ),
    },
    {
      key: "patientid",
      label: "Patient ID",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.patientid}</span>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.age}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, patient) => (
        <span className={`text-[#667085] text-sm`}>{patient.gender}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(patient.phone)}
        </span>
      ),
    },
    {
      key: "branch",
      label: "Branch",
      render: (_, patient) => (
        <span className={` text-[#667085] text-sm`}>{patient.branch}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, patient) => (
        <span className={` text-[#667085] text-sm`}>{patient.occupation}</span>
      ),
    },
    {
      key: "patientid",
      label: "",
      render: (_, patient) => (
        <button>
          <img src={getImageSrc("edit.svg")} alt="" />
        </button>
      ),
    },
  ];

  return (
    <div className="  font-inter ">
      <Tablehead
        tableTitle="Patients"
        tableCount={patients.length}
        showButton={true}
        showControls={true}
        showSearchBar={true}
        onButtonClick={openModal}
      />
      <Table
        data={patients}
        columns={columns}
        rowKey="id"
        pagination={patients.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />

      {/* modal */}
      {isModalOpen && <AddPatientModal onClose={closeModal} />}
    </div>
  );
};

export default FpatientsTable;
