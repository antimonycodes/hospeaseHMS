import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  religion?: string;
  relationship: string;
}

interface PatientData {
  first_name: string;
  last_name: string;
  card_id: string;
  gender: string;
  branch: string;
  phone_number: string;
  occupation: string;
  religion: string;
  address: string;
  age?: number;
  patient_type: string;
  next_of_kin: NextOfKin[];
}

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: PatientData | null;
  isLoading: boolean;
  onSave: (data: PatientData) => void;
}

const EditPatientModal = ({
  isOpen,
  onClose,
  patientData,
  isLoading,
  onSave,
}: // onSave,
EditPatientModalProps) => {
  const [formData, setFormData] = useState<PatientData | null>(null);

  // Update form data when patientData changes or modal opens
  useEffect(() => {
    if (patientData && isOpen) {
      setFormData({
        ...patientData,
        // Make sure next_of_kin is an array with at least one item
        next_of_kin:
          patientData.next_of_kin?.length > 0
            ? [...patientData.next_of_kin]
            : [
                {
                  name: "",
                  last_name: "",
                  gender: "Female",
                  phone: "",
                  occupation: "",
                  address: "",
                  relationship: "",
                  religion: "",
                },
              ],
      });
    }
  }, [patientData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleKinChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number = 0
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    const updatedKin = [...formData.next_of_kin];
    updatedKin[index] = {
      ...updatedKin[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      next_of_kin: updatedKin,
    });
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (formData) {
  //     onSave(formData);
  //   }
  // };

  if (!isOpen || !formData) return null;

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
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-4 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
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
                name="card_id"
                value={formData.card_id}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-4 text-sm"
            />
          </div>

          <hr className="my-8 text-gray-400" />

          {formData.next_of_kin.length > 0 && (
            <div className="pt-4 mt-4">
              <h3 className="text-sm font-medium mb-4">Next of Kin</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.next_of_kin[0].name}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.next_of_kin[0].last_name}
                    onChange={(e) => handleKinChange(e, 0)}
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
                      value={formData.next_of_kin[0].gender}
                      onChange={(e) => handleKinChange(e, 0)}
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
                    value={formData.next_of_kin[0].phone}
                    onChange={(e) => handleKinChange(e, 0)}
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
                    value={formData.next_of_kin[0].occupation}
                    onChange={(e) => handleKinChange(e, 0)}
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
                    value={formData.next_of_kin[0].address}
                    onChange={(e) => handleKinChange(e, 0)}
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
                    value={formData.next_of_kin[0].religion || ""}
                    onChange={(e) => handleKinChange(e, 0)}
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
                    value={formData.next_of_kin[0].relationship}
                    onChange={(e) => handleKinChange(e, 0)}
                    className="w-full border border-gray-300 rounded p-4 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-primary text-white py-2 px-4 rounded text-sm ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              } `}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
