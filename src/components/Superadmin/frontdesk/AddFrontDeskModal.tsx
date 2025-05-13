import { X } from "lucide-react";
import Button from "../../../Shared/Button";
import toast from "react-hot-toast";

interface AddFrontDeskModalProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowModal: (show: boolean) => void;
  createFrontdesk: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<any>;
  updateFrontdesk?: (id: string, data: any) => Promise<any>;
  isEditing?: boolean;
}

const AddFrontDeskModal: React.FC<AddFrontDeskModalProps> = ({
  formData,
  handleInputChange,
  setShowModal,
  createFrontdesk,
  updateFrontdesk,
  isEditing = false,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && updateFrontdesk) {
        const response = await updateFrontdesk(formData.id, formData);
        if (response) {
          toast.success("Frontdesk updated successfully");
          setShowModal(false);
        }
      } else {
        const response = await createFrontdesk(formData);
        if (response) {
          toast.success("Frontdesk created successfully");
          setShowModal(false);
        }
      }
    } catch (error) {
      toast.error("Failed to save frontdesk");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
        <div className="p-4 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-custom-black text-lg font-semibold">
              {isEditing ? "Edit Frontdesk" : "Add New Frontdesk"}
            </h2>
            <button onClick={() => setShowModal(false)} className="">
              <X className="text-black" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="mt-6">
              <Button type="submit">
                {isEditing ? "Update Frontdesk" : "Add Frontdesk"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFrontDeskModal;
