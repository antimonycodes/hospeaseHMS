import { Loader2, X } from "lucide-react";
import {
  CreateNurseData,
  useNurseStore,
} from "../../../store/super-admin/useNuseStore";
import Button from "../../../Shared/Button";
import { useEffect } from "react";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import { useNavigate } from "react-router-dom";

// Create a reusable InfoRow component
interface InfoRowProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-custom-black mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

interface AddOrEditNurseModalProps {
  formData: CreateNurseData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowModal: (show: boolean) => void;
  createNurse: (data: CreateNurseData) => any;
  updateNurse: (id: string, data: CreateNurseData) => any;
  // isCreating: boolean;
  // isLoading: boolean;
  isEditMode: boolean;
  selectedNurseId?: string;
}

const AddOrEditNurseModal: React.FC<AddOrEditNurseModalProps> = ({
  formData,
  handleInputChange,
  setShowModal,
  createNurse,
  updateNurse,
  // isLoading,
  // isCreating,
  isEditMode,
  selectedNurseId,
}) => {
  const department = "nurse";
  const { getAllRoles, roles } = useGlobalStore();
  const isCreating = useNurseStore((state) => state.isCreating);
  const navigate = useNavigate();

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id: roleId, role } = roles[department] || { id: 0, role: "" };

    const payload = {
      ...formData,
      department_id: roleId,
      role,
    };

    let response;
    if (isEditMode && selectedNurseId) {
      response = await updateNurse(selectedNurseId, payload);
    } else {
      response = await createNurse(payload);
    }

    if (response) {
      setShowModal(false);
      navigate(-1);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-custom-black text-lg font-semibold">
              {isEditMode ? "Edit Nurse" : "Add New Nurse"}
            </h2>
            <button onClick={() => setShowModal(false)} className="">
              <X className="text-black" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Upload Picture */}
            <div className="mb-4 flex gap-4">
              <div className="mb-2 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center"></div>
              </div>
              <div className="space-y-2">
                <p className="text-custom-black font-medium">Upload Picture</p>
                <p className="text-xs md:text-sm text-[#667085] w-full md:max-w-2/3">
                  Upload image with at least 6000px by 600px in jpg or png
                  format.
                </p>
                <Button variant="primary">Upload</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Using InfoRow component for all form fields */}
              <InfoRow
                label="First Name"
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="John"
                required
              />

              <InfoRow
                label="Last Name"
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />

              <InfoRow
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="johndoe@example.com"
                required
              />

              <InfoRow
                label="Phone Number"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+23470xxxxxxxx"
                required
              />

              <InfoRow
                label="Date of Birth"
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />

              <InfoRow
                label="Religion"
                id="religion"
                name="religion"
                type="text"
                value={formData.religion}
                onChange={handleInputChange}
                placeholder="Christianity"
              />

              <InfoRow
                label="House Address"
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="10, Road George close, Surulere, Ibadan"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isCreating}
                className={`flex items-center justify-center ${
                  isCreating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-6 mr-2 animate-spin" />
                  </>
                ) : isEditMode ? (
                  "Update Nurse"
                ) : (
                  "Add Nurse"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrEditNurseModal;
