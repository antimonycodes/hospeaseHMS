import { X } from "lucide-react";
import { CreateNurseData } from "../../../store/super-admin/useNuseStore";
import Button from "../../../Shared/Button";

interface AddNurseModalProps {
  formData: CreateNurseData; // Use the same interface as Zustand
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowModal: (show: boolean) => void;
  createNurse: (data: CreateNurseData) => any;
}

const AddNurseModal: React.FC<AddNurseModalProps> = ({
  formData,
  handleInputChange,
  setShowModal,
  createNurse,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const response = await createNurse(formData);
    if (response) {
      setShowModal(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-custom-black text-lg font-semibold">
              Add New Nurse
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
              {/* First Name */}
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="John"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Nurse ID */}
              <div>
                <label
                  htmlFor="nurse_id"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  Nurse ID
                </label>
                {/* <input
                  type="text"
                  id="nurse_id"
                  name="nurse_id"
                  value={formData.nurse_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="HS23455"
                  required
                /> */}
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

              {/* Phone Number */}
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

              {/* Date of Birth */}
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
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
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
                  htmlFor="address"
                  className="block text-sm font-medium text-custom-black mb-1"
                >
                  House Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                  placeholder="10, Road George close, Surulere, Ibadan"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button type="submit">Add Nurse</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNurseModal;
