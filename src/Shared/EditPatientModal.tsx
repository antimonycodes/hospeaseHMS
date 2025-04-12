import { useState } from "react";
import { X } from "lucide-react";

interface NextOfKin {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  religion: string;
  relationship: string;
}

interface PatientData {
  firstName: string;
  lastName: string;
  patientId: string;
  gender: string;
  branch: string;
  phone: string;
  occupation: string;
  religion: string;
  address: string;
  nextOfKin: NextOfKin;
}

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: PatientData;
  isLoading: boolean;
  // onSave: (data: PatientData) => void;
}

const EditPatientModal = ({
  isOpen,
  onClose,
  patientData,
  isLoading,
}: // onSave,
EditPatientModalProps) => {
  const [formData, setFormData] = useState<PatientData>({
    firstName: patientData?.firstName || "",
    lastName: patientData?.lastName || "",
    patientId: patientData?.patientId || "",
    gender: patientData?.gender || "",
    branch: patientData?.branch || "",
    phone: patientData?.phone || "",
    occupation: patientData?.occupation || "Student",
    religion: patientData?.religion || "",
    address: patientData?.address || "",
    nextOfKin: {
      firstName: patientData?.nextOfKin?.firstName || "",
      lastName: patientData?.nextOfKin?.lastName || "",
      gender: "Female",
      phone: patientData?.nextOfKin?.phone || "",
      occupation: "Student",
      address: patientData?.nextOfKin?.address || "",
      religion: patientData?.nextOfKin?.religion || "",
      relationship: patientData?.nextOfKin?.relationship || "",
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Edit Patient</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Patient ID
              </label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                className="w-full border border-gray-300 rounded p-4 text-sm bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Branch</label>
              <div className="relative">
                <select
                  name="branch"
                  value={formData.branch}
                  className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
                >
                  <option value="Agodi">Agodi</option>
                  <option value="Ibadan">Ibadan</option>
                  <option value="Lagos">Lagos</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">
              House Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              className="w-[50%] border border-gray-300 rounded p-4 text-sm"
            />
          </div>

          <hr className=" my-8 text-gray-400" />

          <div className="pt-4 mt-4">
            <h3 className="text-sm font-medium mb-4">Add Next of Kin</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.nextOfKin.firstName}
                  className="w-full border border-gray-300 rounded p-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.nextOfKin.lastName}
                  className="w-full border border-gray-300 rounded p-4 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.nextOfKin.gender}
                    className="w-full border border-gray-300 rounded p-4 text-sm appearance-none pr-8"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.nextOfKin.phone}
                  className="w-full border border-gray-300 rounded p-4 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.nextOfKin.occupation}
                  className="w-full border border-gray-300 rounded p-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  House Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.nextOfKin.address}
                  className="w-full border border-gray-300 rounded p-4 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Religion
                </label>
                <input
                  type="text"
                  name="religion"
                  value={formData.nextOfKin.religion}
                  className="w-full border border-gray-300 rounded p-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Relationship with Patient
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.nextOfKin.relationship}
                  className="w-full border border-gray-300 rounded p-4 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              // onClick={handleSubmit}
              disabled={!!isLoading}
              className={`bg-primary text-white py-2 px-4 rounded text-sm ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              } `}
            >
              {isLoading ? "Editting" : "Edit Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
