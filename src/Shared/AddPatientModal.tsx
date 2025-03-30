import { useState } from "react";
import Input from "./Input";
import { X } from "lucide-react";
import { CreatePatientData } from "../store/super-admin/usePatientStore";

interface AddPatientModalProps {
  onClose: () => void;
  createPatient: (data: CreatePatientData) => any;
}

const AddPatientModal = ({ onClose, createPatient }: AddPatientModalProps) => {
  const [patient, setPatient] = useState({
    first_name: "",
    last_name: "",
    card_id: "",
    branch_id: "",
    phone_number: "",
    occupation: "",
    religion: "",
    address: "",
    gender: "",
    patient_type: "",
  });

  const [nextOfKin, setNextOfKin] = useState({
    name: "",
    last_name: "",
    gender: "",
    phone: "",
    occupation: "",
    address: "",
    relationship: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const { name, value } = e.target;
    if (field === "patient") {
      setPatient((prev) => ({ ...prev, [name]: value }));
    } else {
      setNextOfKin((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const response = await createPatient({
      ...patient,
      next_of_kin: [nextOfKin],
    });

    if (response) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add new Patient</h2>
          <button onClick={onClose} className="hover:text-gray-200">
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="first_name"
            placeholder="First Name"
            value={patient.first_name}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="last_name"
            placeholder="Last Name"
            value={patient.last_name}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="card_id"
            placeholder="Card ID"
            value={patient.card_id}
            onChange={(e) => handleChange(e, "patient")}
          />

          {/* Gender Select */}
          <select
            name="gender"
            value={patient.gender}
            onChange={(e) => handleChange(e, "patient")}
            className="border p-2 rounded text-gray-400"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <Input
            name="branch_id"
            placeholder="Branch"
            value={patient.branch_id}
            onChange={(e) => handleChange(e, "patient")}
          />
          <Input
            name="phone_number"
            placeholder="Phone Number"
            value={patient.phone_number}
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

          {/* Patient Type Select */}
          <select
            name="patient_type"
            value={patient.patient_type}
            onChange={(e) => handleChange(e, "patient")}
            className="border p-2 rounded text-gray-400"
          >
            <option value="" disabled>
              Select Patient Type
            </option>
            <option value="HMO">HMO</option>
            <option value="Regular">Regular</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <hr className="my-12 text-[#979797]" />

        {/* Next of Kin */}
        <div>
          <h3 className="text-md font-semibold mb-2">Add Next of Kin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              name="name"
              placeholder="First Name"
              value={nextOfKin.name}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="last_name"
              placeholder="Last Name"
              value={nextOfKin.last_name}
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
              name="address"
              placeholder="House Address"
              value={nextOfKin.address}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
            <Input
              name="relationship"
              placeholder="Relationship"
              value={nextOfKin.relationship}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />

            {/* Next of Kin Gender Select */}
            <select
              name="gender"
              value={nextOfKin.gender}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border p-2 rounded text-gray-400"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-primary w-fit text-white px-4 py-2 rounded mt-4"
        >
          Add Patient
        </button>
      </div>
    </div>
  );
};

export default AddPatientModal;
