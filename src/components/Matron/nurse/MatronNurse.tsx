import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import { nurses as nursesData } from "../../../data/nurseData";
import AddNurseModal from "../../Superadmin/nurses/AddNurseModal";
import { useState } from "react";
import MatronNurseModal from "./MatronNurseModal";

interface Nurse {
  name: string;
  id: string;
  phone: string;
  email: string;
  status: string;
  picture: string;
}

const MatronNurse = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nurseId: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
    password: "",
  });
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewMore = (nurse: Nurse) => {
    console.log("View more clicked for:", nurse);
  };

  const columns: {
    key: keyof Nurse;
    label: string;
    render: (value: string | number, row: Nurse) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.picture}
            alt="Nurse"
            className="h-10 w-10 border rounded-full object-cover border-gray-300"
          />
          <span className="text-sm text-custom-black font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "id",
      label: "Nurse ID",
      render: (value) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <span className="text-sm text-[#667085]">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`py-1.5 px-2.5 rounded-full text-sm ${
            value === "Available"
              ? "text-[#F83E41] bg-[#FCE9E9]"
              : "text-[#009952] bg-[#CCFFE7]"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "id",
      label: "Action",
      render: (value, row) => (
        <span
          onClick={() => handleViewMore(row)}
          className="text-[#009952] font-medium text-sm cursor-pointer"
        >
          View More
        </span>
      ),
    },
  ];

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Nurses"
        showButton={true}
        showSearchBar={false}
        showControls={false}
        onButtonClick={openModal}
      />
      {/* Add Nurse Modal */}
      {isModalOpen && (
        <MatronNurseModal
          handleInputChange={handleInputChange}
          onClose={closeModal}
          formData={formData}
        />
      )}

      <Table
        data={nursesData}
        columns={columns}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default MatronNurse;
