import { useLocation } from "react-router-dom";
import Button from "./Button";
import { X } from "lucide-react";

interface AddDoctorModalProps {
  formData: {
    doctor_id?: null;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    religion: string;
    houseAddress: string;
    consultant_id?: string | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowModal: (show: boolean) => void;
  createDoctor: (data: any) => Promise<void>;
  createConsultant: (data: any) => Promise<void>;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  formData,
  handleInputChange,
  setShowModal,
  createDoctor,
  createConsultant,
}) => {
  const location = useLocation();
  const isConsultant = location.pathname.includes("consultant");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await (isConsultant ? createConsultant : createDoctor)({
      ...formData,
      ...(isConsultant
        ? { consultant_id: formData.consultant_id ?? null }
        : { doctor_id: formData.doctor_id ?? null }),
    });
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-custom-black">
              Add New Doctor
            </h2>
            <button onClick={() => setShowModal(false)}>
              <X className="text-black" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <div>
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
            </div>

            <Button type="submit">Add Doctor</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
