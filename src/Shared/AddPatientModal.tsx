import { useEffect, useState } from "react";
import Input from "./Input";
import { X } from "lucide-react";
import { CreatePatientData } from "../store/super-admin/usePatientStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalStore } from "../store/super-admin/useGlobal";

interface AddPatientModalProps {
  onClose: () => void;
  createPatient: (
    data: CreatePatientData,
    endpoint: string,
    refreshendpoint: string
  ) => any; // Add endpoint as a parameter
  isLoading: boolean;
  endpoint: string;
  refreshendpoint: string;
}
const AddPatientModal = ({
  onClose,
  createPatient,
  isLoading,
  endpoint,
  refreshendpoint, // Add the endpoint here
}: AddPatientModalProps) => {
  const [patient, setPatient] = useState<{
    first_name: string;
    last_name: string;
    card_id: string;
    branch_id: string;
    phone_number: string;
    occupation: string;
    religion: string;
    address: string;
    gender: string;
    patient_type: string;
    dob: Date | null;
    clinical_patient_type: number;
  }>({
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
    dob: null,
    clinical_patient_type: 0,
  });

  const [nextOfKin, setNextOfKin] = useState({
    name: "",
    last_name: "",
    gender: "",
    phone: "",
    occupation: "",
    address: "",
    relationship: "",
    clinical_patient_type: "",
  });

  const { branches, getBranches, clinicaldepts, getClinicaldept } =
    useGlobalStore();

  useEffect(() => {
    getBranches();
    getClinicaldept();
  }, []);

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
    const response = await createPatient(
      {
        ...patient,
        dob: patient.dob
          ? `${patient.dob.getFullYear()}-${String(
              patient.dob.getMonth() + 1
            ).padStart(2, "0")}-${String(patient.dob.getDate()).padStart(
              2,
              "0"
            )}`
          : "",
        next_of_kin: [nextOfKin],
      },
      endpoint,
      refreshendpoint
    );

    if (response) {
      onClose();
    }
  };
  const handleDateChange = (date: any) => {
    setPatient((prev) => ({ ...prev, dob: date }));
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

          {/* Patient Type Select */}
          <select
            name="patient_type"
            value={patient.patient_type}
            onChange={(e) => handleChange(e, "patient")}
            className="border p-2 rounded text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary "
          >
            <option value="" disabled>
              Select Patient Type
            </option>
            <option value="Insurance">Insurance</option>
            <option value="Organised Private Scheme">
              Organised Private Scheme
            </option>
            <option value="Regular Private">Regular Private</option>
          </select>

          <DatePicker
            selected={patient.dob}
            onChange={handleDateChange}
            placeholderText="Date of birth"
            className="border border-[#D0D5DD]  p-4 rounded w-full"
            dateFormat="yyyy-MM-dd"
          />

          {/* Gender Select */}
          <select
            name="gender"
            value={patient.gender}
            onChange={(e) => handleChange(e, "patient")}
            className="border p-2 rounded text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary "
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Branch Select */}
          <select
            name="branch_id"
            value={patient.branch_id}
            onChange={(e) => handleChange(e, "patient")}
            className="border p-2 rounded text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary "
          >
            <option value="" disabled>
              Select Branch
            </option>
            {branches?.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.attributes.name}
              </option>
            ))}
          </select>

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
          {/* Clinical Department Select */}
          <select
            name="clinical_patient_type"
            value={patient.clinical_patient_type}
            onChange={(e) => handleChange(e, "patient")}
            className="border p-2 rounded text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary "
          >
            <option value="" disabled>
              Select Clinical Department
            </option>
            {clinicaldepts?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.attributes.name}
              </option>
            ))}
          </select>
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
            {/* Next of Kin Gender Select */}
            <select
              name="gender"
              value={nextOfKin.gender}
              onChange={(e) => handleChange(e, "nextOfKin")}
              className="border p-2 rounded text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary "
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Input
              name="relationship"
              placeholder="Relationship"
              value={nextOfKin.relationship}
              onChange={(e) => handleChange(e, "nextOfKin")}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!!isLoading}
          className={`bg-primary w-fit text-white px-4 py-2 rounded mt-4
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
          {isLoading ? "Adding Patient..." : "Add Patient"}
        </button>
      </div>
    </div>
  );
};

export default AddPatientModal;
