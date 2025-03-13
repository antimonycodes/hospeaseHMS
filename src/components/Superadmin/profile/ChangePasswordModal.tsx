import { X } from "lucide-react";
import Button from "../../../Shared/Button";

interface ChangePasswordModalProps {
  setShowModal: (show: boolean) => void;
}

const ChangePasswordModal = ({ setShowModal }: ChangePasswordModalProps) => {
  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className=" p-4 md:p-12">
          {/* header */}
          <div className=" flex flex-col md:flex-row justify-between items-center mb-4 ">
            <h2 className=" text-custom-black text-lg font-medium">
              Change Password
            </h2>
            <button onClick={() => setShowModal(false)} className="">
              <X className=" text-black" />
            </button>
          </div>
          {/* form */}
          <form action="" className=" space-y-8">
            {/*  */}
            <div>
              <label
                htmlFor="Invoice Number"
                className="block text-sm font-medium text-custom-black  mb-1"
              >
                Old Password
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="**********"
                required
              />
            </div>
            {/*  */}
            <div>
              <label
                htmlFor="Invoice Number"
                className="block text-sm font-medium text-custom-black  mb-1"
              >
                New Password
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="**********"
                required
              />
            </div>
            {/*  */}
            <div>
              <label
                htmlFor="Invoice Number"
                className="block text-sm font-medium text-custom-black  mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="**********"
                required
              />
            </div>
            {/* button */}
            <div className=" mt-8">
              <Button variant="primary">Update Password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
