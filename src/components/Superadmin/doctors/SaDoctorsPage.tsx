import { useState } from "react";
import DoctorsTable from "./DoctorsTable";
import AddDoctorModal from "../../../Shared/AddDoctorModal";

const SaDoctorsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    religion: "",
    houseAddress: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div className="  rounded-lg custom-shadow bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Doctors{" "}
          <span className="text-[#6941C6] bg-[#F9F5FF] py-1 px-4 rounded-full text-sm">
            {/* {doctors.length} */}
          </span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-green-700 text-white px-4 py-4 rounded-md flex items-center"
        >
          <span className="mr-1">Add new</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.33333V12.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.33334 8H12.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* table */}
      <DoctorsTable />

      {/* Add Doctor Modal */}
      {showModal && (
        <AddDoctorModal
          formData={formData}
          handleInputChange={handleInputChange}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default SaDoctorsPage;
