import { JSX, useState } from "react";
import Table from "../../../Shared/Table";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { getImageSrc } from "../../../utils/imageUtils";
import AddPatientModal from "./AddPatientModal";

type Patient = {
  id: string;
  lastVisit: string;
  name: string;
  phone: string;
  gender: "Male" | "Female";
  patientid: string;
  branch: string;
  occupation: string;
  age: number;
};

const FpatientsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const patients: Patient[] = [
    {
      id: "1",
      lastVisit: "01-01-2025",
      name: "Philip Ikiriko",
      phone: "+2348035839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 28,
    },
    {
      id: "2",
      lastVisit: "01-01-2025",
      name: "Deborah Durojaiye",
      phone: "+2348025839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 34,
    },
    {
      id: "3",
      lastVisit: "01-01-2025",
      name: "Victoria Ilesanmi",
      phone: "+2348055839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 22,
    },
    {
      id: "4",
      lastVisit: "01-01-2025",
      name: "John Doe",
      phone: "+2348075839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 45,
    },
    {
      id: "5",
      lastVisit: "01-01-2025",
      name: "Jane Smith",
      phone: "+2348095839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 30,
    },
    {
      id: "6",
      lastVisit: "01-01-2025",
      name: "Michael Johnson",
      phone: "+2348105839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 50,
    },
    {
      id: "7",
      lastVisit: "01-01-2025",
      name: "Sarah Brown",
      phone: "+2348115839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 27,
    },
    {
      id: "8",
      lastVisit: "01-01-2025",
      name: "David Wilson",
      phone: "+2348125839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 33,
    },
    {
      id: "9",
      lastVisit: "01-01-2025",
      name: "Laura Martinez",
      phone: "+2348135839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 29,
    },
    {
      id: "10",
      lastVisit: "01-01-2025",
      name: "James Anderson",
      phone: "+2348145839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 40,
    },
    {
      id: "11",
      lastVisit: "01-01-2025",
      name: "Emily Taylor",
      phone: "+2348155839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 35,
    },
    {
      id: "12",
      lastVisit: "01-01-2025",
      name: "Daniel Thomas",
      phone: "+2348165839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 31,
    },
    {
      id: "13",
      lastVisit: "01-01-2025",
      name: "Olivia Jackson",
      phone: "+2348175839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 26,
    },
    {
      id: "14",
      lastVisit: "01-01-2025",
      name: "William White",
      phone: "+2348185839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 38,
    },
    {
      id: "15",
      lastVisit: "01-01-2025",
      name: "Sophia Harris",
      phone: "+2348195839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 32,
    },
    {
      id: "16",
      lastVisit: "01-01-2025",
      name: "Benjamin Clark",
      phone: "+2348205839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 41,
    },
    {
      id: "17",
      lastVisit: "01-01-2025",
      name: "Ava Lewis",
      phone: "+2348215839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 28,
    },
    {
      id: "18",
      lastVisit: "01-01-2025",
      name: "Henry Walker",
      phone: "+2348225839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 36,
    },
    {
      id: "19",
      lastVisit: "01-01-2025",
      name: "Mia Hall",
      phone: "+2348235839499",
      gender: "Female",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 29,
    },
    {
      id: "20",
      lastVisit: "01-01-2025",
      name: "Samuel Young",
      phone: "+2348245839499",
      gender: "Male",
      patientid: "0010602",
      branch: "Agodi",
      occupation: "Banker",
      age: 37,
    },
  ];

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
    <div className="w-full font-inter h-full bg-white rounded-[8px] shadow overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-[18px] w-[160px] font-medium">
          Patients{" "}
          <span className="bg-[#F9F5FF] py-[2px] px-[8px] rounded-[16px] text-[#6941C6] font-medium text-[12px]">
            {patients.length}
          </span>
        </h1>

        {/* search / filter / add button
         */}
        {/* search */}
        <div className="flex w-full items-center gap-2 border border-gray-200 py-2 px-4 rounded-[10px] md:w-[70%]">
          {/* icon */}
          <img src={getImageSrc("search.svg")} alt="" />
          {/* input */}
          <input
            type="search"
            name=""
            id=""
            placeholder="Type to search"
            className="outline-none font-medium placeholder:text-xs text-xs"
          />
        </div>
        <div className="flex items-center gap-4">
          {/* filter and add button */}
          <div className="flex items-center gap-4">
            {/* filter */}
            <button className="cursor-pointer">
              <img src={getImageSrc("filter.svg")} alt="" />
            </button>

            {/* add button */}
            <button
              onClick={openModal}
              className="w-[120px] flex items-center justify-center gap-2 cursor-pointer text-white text-sm bg-primary h-[40px] rounded-[8px]"
            >
              Add new
              <img src={getImageSrc("plus.svg")} alt="" />
            </button>
          </div>
        </div>
      </div>
      <Table
        data={patients}
        columns={columns}
        rowKey="id"
        pagination={patients.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />

      {/* modal */}
      <AddPatientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default FpatientsTable;
