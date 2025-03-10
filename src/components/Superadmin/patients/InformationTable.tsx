import { JSX } from "react";
import Table from "../../../Shared/Table";
import { useNavigate } from "react-router-dom";

type InformationData = {
  name: string;
  patientId: string;
  age: number;
  gender: string;
  phone: string;
  branch: string;
  occupation: string;
  viewMore: string;
};

type Columns = {
  key: keyof InformationData | "viewMore";
  label: string;
  render?: (value: any, patient: InformationData) => JSX.Element;
};

const InformationTable = () => {
  const navigate = useNavigate();
  const handleViewMore = (patientId: string) => {
    navigate(`/dashboard/patients/${patientId}`);
  };

  const informationData: InformationData[] = [
    {
      name: "Philip Ikiko",
      patientId: "001602",
      age: 32,
      gender: "male",
      phone: "2347098765435",
      branch: "agodi",
      occupation: "Banker",
      viewMore: "View More",
    },
    {
      name: "Philip Ikiko",
      patientId: "001602",
      age: 32,
      gender: "male",
      phone: "2347098765435",
      branch: "agodi",
      occupation: "Banker",
      viewMore: "View More",
    },
    {
      name: "Philip Ikiko",
      patientId: "001602",
      age: 32,
      gender: "male",
      phone: "2347098765435",
      branch: "agodi",
      occupation: "Banker",
      viewMore: "View More",
    },
    {
      name: "Philip Ikiko",
      patientId: "001602",
      age: 32,
      gender: "male",
      phone: "2347098765435",
      branch: "agodi",
      occupation: "Banker",
      viewMore: "View More",
    },
  ];

  const columns: Columns[] = [
    {
      key: "name",
      label: "Name",
      render: (_, data) => (
        <span className="font-medium text-[#101828]">{data.name}</span>
      ),
    },
    {
      key: "patientId",
      label: "Patient ID",
      render: (_, data) => (
        <span className="text-[#667085]">{data.patientId}</span>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (_, data) => <span className="text-[#667085]">{data.age}</span>,
    },
    {
      key: "gender",
      label: "Gender",
      render: (_, data) => (
        <span className="text-[#667085]">{data.gender}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, data) => <span className="text-[#667085]">{data.phone}</span>,
    },
    {
      key: "branch",
      label: "Branch",
      render: (_, data) => (
        <span className="text-[#667085]">{data.branch}</span>
      ),
    },
    {
      key: "occupation",
      label: "Occupation",
      render: (_, data) => (
        <span className="text-[#667085]">{data.occupation}</span>
      ),
    },
    {
      key: "viewMore",
      label: "",
      render: (_, data) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => handleViewMore(data.patientId)}
        >
          View More
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-full">
      <Table
        data={informationData}
        columns={columns}
        rowKey="patientId"
        pagination={informationData.length > 10}
        rowsPerPage={10}
      />
    </div>
  );
};

export default InformationTable;
