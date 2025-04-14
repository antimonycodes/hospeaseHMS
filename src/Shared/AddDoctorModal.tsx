import { useLocation } from "react-router-dom";
import Button from "./Button";
import { X } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import { useEffect } from "react";

interface AddDoctorModalProps {
  formData: {
    doctor_id?: null | string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    religion: string;
    houseAddress: string;
    // department_id: number;
    dob?: string; //
    consultant_id?: null | string;
    endpoint?: string;
    refreshEndpoint?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowModal: (show: boolean) => void;
  createDoctor: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<void>;
  createConsultant: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<void>;
  isLoading: boolean;
  endpoint?: string;
  refreshEndpoint?: string;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  formData,
  handleInputChange,
  setShowModal,
  createDoctor,
  createConsultant,
  isLoading,
  endpoint,
  refreshEndpoint,
}) => {
  const location = useLocation();
  const isConsultant = location.pathname.includes("consultants");

  const department = "doctor";
  const { getAllRoles, roles } = useGlobalStore();

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  console.log(roles, "dfg");

  // Dynamically fallback to correct endpoint if not passed from parent
  const finalEndpoint =
    endpoint ??
    (isConsultant ? "/admin/consultant/create" : "/admin/doctor/create");
  const finalRefreshEndpoint =
    refreshEndpoint ??
    (isConsultant ? "/admin/consultant/fetch" : "/admin/doctor/fetch");

  const handleSubmit = async (e: React.FormEvent) => {
    const { id, role } = roles[department];

    console.log(id, "id");

    e.preventDefault();
    const payload = {
      department_id: id,
      ...formData,
      address: formData.houseAddress, // Map houseAddress to address for store compatibility
      [isConsultant ? "consultant_id" : "doctor_id"]:
        formData[isConsultant ? "consultant_id" : "doctor_id"] ?? null,
    };
    await (isConsultant ? createConsultant : createDoctor)(
      payload,
      finalEndpoint,
      finalRefreshEndpoint
    );
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-custom-black">
              Add New {isConsultant ? "Consultant" : "Doctor"}
            </h2>
            <button onClick={() => setShowModal(false)}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] rounded-md"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] rounded-md"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] rounded-md"
                  placeholder="johndoe@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] rounded-md"
                  placeholder="+23470xxxxxxxx"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="religion"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Religion
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] rounded-md"
                  placeholder="Christianity"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="houseAddress"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                House Address
              </label>
              <input
                type="text"
                id="houseAddress"
                name="houseAddress"
                value={formData.houseAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-4 border border-[#D0D5DD] rounded-md"
                placeholder="10, Road George close, Ibadan"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isConsultant ? "Add Consultant" : "Add Doctor"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
