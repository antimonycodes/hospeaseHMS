import { useState } from "react";
import Input from "./Input";
import { X } from "lucide-react";

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
    e: React.ChangeEvent<HTMLInputElement>,
    type: "patient" | "nextOfKin"
  ) => {
    const { name, value } = e.target;
    type === "patient"
      ? setPatient({ ...patient, [name]: value })
      : setNextOfKin({ ...nextOfKin, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6  shadow-lg h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add new Patient</h2>
          <button onClick={onClose} className="hover:text-gray-200">
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            name="firstName"
            placeholder="First Name"
            value={patient.firstName}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="lastName"
            placeholder="Last Name"
            value={patient.lastName}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="patientId"
            value={patient.patientId}
            onChange={() => {}}
            className="bg-gray-100"
          />
          <Input
            name="branch"
            placeholder="Branch"
            value={patient.branch}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="phone"
            placeholder="Phone Number"
            value={patient.phone}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="occupation"
            placeholder="Occupation"
            value={patient.occupation}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="religion"
            placeholder="Religion"
            value={patient.religion}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="address"
            placeholder="House Address"
            value={patient.address}
            onChange={(e) => handleChange(e, "patient")}
          />
        </div>

        <hr className="my-12 text-[#979797]" />

        <div>
          <h3 className="text-md font-semibold mb-2">Add Next of Kin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={nextOfKin.firstName}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={nextOfKin.lastName}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="phone"
              placeholder="Phone Number"
              value={nextOfKin.phone}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="occupation"
              placeholder="Occupation"
              value={nextOfKin.occupation}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="religion"
              placeholder="Religion"
              value={nextOfKin.religion}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="address"
              placeholder="House Address"
              value={nextOfKin.address}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="relationship"
              placeholder="Relationship with Patient"
              value={nextOfKin.relationship}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
          </div>
        </div>

        <button className="bg-primary w-fit text-white px-4 py-2 rounded  mt-4">
          Add Patient
        </button>
      </div>
    </div>
  );
};

export default AddPatientModal;
