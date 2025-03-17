import { JSX } from "react";
import Table from "../../Shared/Table";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber"; // Import the function

type Patient = {
  id: string;
  lastVisit: string;
  name: string;
  phone: string;
  gender: "Male" | "Female";
  age: number;
};

const FrontdeskTable = () => {
  const patients: Patient[] = [
    {
      id: "1",
      lastVisit: "01-01-2025",
      name: "Philip Ikiriko",
      phone: "+2348035839499",
      gender: "Male",
      age: 28,
    },
    {
      id: "2",
      lastVisit: "01-01-2025",
      name: "Deborah Durojaiye",
      phone: "+2348025839499",
      gender: "Female",
      age: 34,
    },
    {
      id: "3",
      lastVisit: "01-01-2025",
      name: "Victoria Ilesanmi",
      phone: "+2348055839499",
      gender: "Female",
      age: 22,
    },
    {
      id: "4",
      lastVisit: "01-01-2025",
      name: "John Doe",
      phone: "+2348075839499",
      gender: "Male",
      age: 45,
    },
    {
      id: "5",
      lastVisit: "01-01-2025",
      name: "Jane Smith",
      phone: "+2348095839499",
      gender: "Female",
      age: 30,
    },
    {
      id: "6",
      lastVisit: "01-01-2025",
      name: "Michael Johnson",
      phone: "+2348105839499",
      gender: "Male",
      age: 50,
    },
    {
      id: "7",
      lastVisit: "01-01-2025",
      name: "Sarah Brown",
      phone: "+2348115839499",
      gender: "Female",
      age: 27,
    },
    {
      id: "8",
      lastVisit: "01-01-2025",
      name: "David Wilson",
      phone: "+2348125839499",
      gender: "Male",
      age: 33,
    },
    {
      id: "9",
      lastVisit: "01-01-2025",
      name: "Laura Martinez",
      phone: "+2348135839499",
      gender: "Female",
      age: 29,
    },
    {
      id: "10",
      lastVisit: "01-01-2025",
      name: "James Anderson",
      phone: "+2348145839499",
      gender: "Male",
      age: 40,
    },
    {
      id: "11",
      lastVisit: "01-01-2025",
      name: "Emily Taylor",
      phone: "+2348155839499",
      gender: "Female",
      age: 35,
    },
    {
      id: "12",
      lastVisit: "01-01-2025",
      name: "Daniel Thomas",
      phone: "+2348165839499",
      gender: "Male",
      age: 31,
    },
    {
      id: "13",
      lastVisit: "01-01-2025",
      name: "Olivia Jackson",
      phone: "+2348175839499",
      gender: "Female",
      age: 26,
    },
    {
      id: "14",
      lastVisit: "01-01-2025",
      name: "William White",
      phone: "+2348185839499",
      gender: "Male",
      age: 38,
    },
    {
      id: "15",
      lastVisit: "01-01-2025",
      name: "Sophia Harris",
      phone: "+2348195839499",
      gender: "Female",
      age: 32,
    },
    {
      id: "16",
      lastVisit: "01-01-2025",
      name: "Benjamin Clark",
      phone: "+2348205839499",
      gender: "Male",
      age: 41,
    },
    {
      id: "17",
      lastVisit: "01-01-2025",
      name: "Ava Lewis",
      phone: "+2348215839499",
      gender: "Female",
      age: 28,
    },
    {
      id: "18",
      lastVisit: "01-01-2025",
      name: "Henry Walker",
      phone: "+2348225839499",
      gender: "Male",
      age: 36,
    },
    {
      id: "19",
      lastVisit: "01-01-2025",
      name: "Mia Hall",
      phone: "+2348235839499",
      gender: "Female",
      age: 29,
    },
    {
      id: "20",
      lastVisit: "01-01-2025",
      name: "Samuel Young",
      phone: "+2348245839499",
      gender: "Male",
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
        <span className=" text-[#101828] font-medium text-sm">
          {patient.name}
        </span>
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
      key: "phone",
      label: "Phone",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">
          {formatPhoneNumber(patient.phone)}
        </span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, patient) => (
        <span className={` text-[#667085] text-sm`}>{patient.gender}</span>
      ),
    },
    {
      key: "lastVisit",
      label: "Last Visit",
      render: (_, patient) => (
        <span className="text-[#667085] text-sm">{patient.lastVisit}</span>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-white rounded-[8px] shadow overflow-hidden">
      <div className="p-6">
        <h1 className="text-[18px] font-medium">Recent Patients</h1>
      </div>
      <Table
        data={patients}
        columns={columns}
        rowKey="id"
        pagination={patients.length > 10}
        rowsPerPage={10}
        radius="rounded-none"
      />
    </div>
  );
};

export default FrontdeskTable;
