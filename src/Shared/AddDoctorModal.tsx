import Button from "./Button";
import { X } from "lucide-react";
interface AddDoctorModalProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    religion: string;
    houseAddress: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowModal: (show: boolean) => void;
}
const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  formData,
  handleInputChange,

  setShowModal,
}) => {
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4 ">
            <h2 className=" text-custom-black text-lg font-semibold">
              Add New Doctor
            </h2>
            <button onClick={() => setShowModal(false)} className="">
              <X className=" text-black" />
            </button>
          </div>

          <form>
            {/* Upload Picture */}
            <div className="mb-4 flex gap-4 ">
              <div className="mb-2 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className=" space-y-2">
                <p className=" text-custom-black font-medium">Upload Picture</p>
                <p className="text-xs md:text-sm text-[#667085] w-full md:max-w-2/3">
                  Upload image with at least 6000px by 600px in jpg or png
                  format.
                </p>
                {/* <button
                      type="button"
                      className="mt-2 bg-primary text-white rounded-md px-4 py-4 text-sm"
                    >
                      Upload
                    </button> */}
                <Button variant="primary">Upload</Button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-custom-black  mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-custom-black  mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-custom-black  mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="johndoe@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-custom-black  mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="+23470xxxxxxxx"
                  required
                />
              </div>
            </div>

            {/* Religion and Address */}
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="religion"
                  className="block text-sm font-medium text-custom-black  mb-1"
                >
                  Religion
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="Christianity"
                />
              </div>
              <div>
                <label
                  htmlFor="houseAddress"
                  className="block text-sm font-medium text-custom-black  mb-1"
                >
                  House Address
                </label>
                <input
                  type="text"
                  id="houseAddress"
                  name="houseAddress"
                  value={formData.houseAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="10, Road George close, Surdere Ibadan"
                />
              </div>
            </div>
            {/* 
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-green-700 text-white font-medium py-4 px-4 rounded-md"
                >
                  Add Doctor
                </button> */}
            <Button>Add Doctor</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
