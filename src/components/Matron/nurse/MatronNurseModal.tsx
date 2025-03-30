import { X } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  nurseId: string;
  email: string;
  phone: string;
  religion: string;
  houseAddress: string;
  password: string;
}

interface MatronNurseModalProps {
  onClose: () => void;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MatronNurseModal: React.FC<MatronNurseModalProps> = ({
  onClose,
  formData,
  handleInputChange,
}) => {
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-custom-black text-lg font-semibold">
              Add New Nurse
            </h2>
            <button onClick={onClose}>
              <X className="text-black" />
            </button>
          </div>

          <form>
            {/* Upload Picture */}
            <div className="mb-4 flex gap-4">
              <div className="mb-2 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center"></div>
              </div>
              <div className="space-y-2">
                <p className="text-custom-black font-medium">Upload Picture</p>
                <p className="text-xs md:text-sm text-[#667085] w-full md:max-w-2/3">
                  Upload image with at least 600px by 600px in jpg or png
                  format.
                </p>
                <button
                  type="button"
                  className="mt-2 bg-primary text-white rounded-md px-4 py-2 text-sm"
                >
                  Upload
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
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
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="John"
                  required
                />
              </div>

              {/* Last Name */}
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
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Nurse ID */}
              <div>
                <label
                  htmlFor="nurseId"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Nurse ID
                </label>
                <input
                  type="text"
                  id="nurseId"
                  name="nurseId"
                  value={formData.nurseId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="HS23455"
                  required
                />
              </div>

              {/* Email */}
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
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="johndoe@example.com"
                  required
                />
              </div>

              {/* Phone */}
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
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="+23470xxxxxxxx"
                  required
                />
              </div>

              {/* Religion */}
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
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="Christianity"
                />
              </div>

              {/* House Address */}
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
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="10, Road George close, Surulere, Ibadan"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="Enter a secure password"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm"
              >
                Add Nurse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatronNurseModal;
