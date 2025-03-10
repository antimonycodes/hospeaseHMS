import { X } from "lucide-react";
import { useState } from "react";

const AddPatientModal = ({ onClose }: { onClose: () => void }) => {
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    patientId: "0010602",
    gender: "Male",
    branch: "Agodi",
    phone: "",
    occupation: "",
    religion: "",
    address: "",
  });

  const [nextOfKin, setNextOfKin] = useState({
    firstName: "",
    lastName: "",
    gender: "Female",
    phone: "",
    occupation: "",
    religion: "",
    address: "",
    relationship: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: "patient" | "nextOfKin"
  ) => {
    const { name, value } = e.target;
    type === "patient"
      ? setPatient({ ...patient, [name]: value })
      : setNextOfKin({ ...nextOfKin, [name]: value });
  };

  return (
    <div className="fixed inset-0  bg-[#1E1E1E40] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add new Patient</h2>
          <button onClick={onClose} className=" hover:text-gray-200">
            <X />
          </button>
        </div>

        {/* Patient Form */}
        <div className="grid grid-cols-2 gap-8 ">
          <input
            name="firstName"
            placeholder="First Name"
            value={patient.firstName}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={patient.lastName}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded"
          />
          <input
            name="patientId"
            value={patient.patientId}
            disabled
            className="border border-[#D0D5DD] p-4 rounded bg-gray-100"
          />
          <select
            name="gender"
            value={patient.gender}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
          <input
            name="branch"
            placeholder="Branch"
            value={patient.branch}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={patient.phone}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded"
          />
          <input
            name="occupation"
            placeholder="Occupation"
            value={patient.occupation}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded"
          />
          <input
            name="religion"
            placeholder="Religion"
            value={patient.religion}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded"
          />
          <input
            name="address"
            placeholder="House Address"
            value={patient.address}
            onChange={(e) => handleChange(e, "patient")}
            className="border border-[#D0D5DD] p-4 rounded "
          />
        </div>
        <hr className=" my-12 text-[#979797]" />

        {/* Next of Kin */}
        <div className=" ">
          <h3 className="text-md font-semibold mb-2">Add Next of Kin</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={nextOfKin.firstName}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={nextOfKin.lastName}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded"
            />
            <select
              name="gender"
              value={nextOfKin.gender}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
            <input
              name="phone"
              placeholder="Phone Number"
              value={nextOfKin.phone}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded"
            />
            <input
              name="occupation"
              placeholder="Occupation"
              value={nextOfKin.occupation}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded"
            />
            <input
              name="religion"
              placeholder="Religion"
              value={nextOfKin.religion}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded"
            />
            <input
              name="address"
              placeholder="House Address"
              value={nextOfKin.address}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded "
            />
            <input
              name="relationship"
              placeholder="Relationship with Patient"
              value={nextOfKin.relationship}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border border-[#D0D5DD] p-4 rounded "
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="bg-primary w-fit text-white px-4 py-2 rounded hover:bg-green-700  mt-4">
          Add Patient
        </button>
      </div>
    </div>
  );
};

export default AddPatientModal;
