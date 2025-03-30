import { X } from "lucide-react";
import Button from "../../../Shared/Button";
import { ChangePasswordData } from "../../../store/super-admin/useProfileStore";
import { useState } from "react";

interface ChangePasswordModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  changePassword: (data: ChangePasswordData) => Promise<any>;
}

const ChangePasswordModal = ({
  setShowModal,
  isLoading,
  changePassword,
}: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState<ChangePasswordData>({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await changePassword(formData);
    if (response) {
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl max-h-[90%]">
        <div className="p-4 md:p-12">
          {/* header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-custom-black text-lg font-medium">
              Change Password
            </h2>
            <button onClick={() => setShowModal(false)} className="">
              <X className="text-black" />
            </button>
          </div>
          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="old_password"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                Old Password
              </label>
              <input
                type="password"
                id="old_password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="**********"
                required
              />
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="**********"
                required
              />
            </div>

            <div>
              <label
                htmlFor="new_password_confirmation"
                className="block text-sm font-medium text-custom-black mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="new_password_confirmation"
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                className="w-full px-3 py-4 border border-[#D0D5DD] placeholder:text-[#98A2B3] rounded-md"
                placeholder="**********"
                required
              />
            </div>

            {/* button */}
            <div className="mt-8">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
