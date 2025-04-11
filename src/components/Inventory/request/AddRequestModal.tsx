import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import Button from "../../../Shared/Button";

interface AddRequestModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
}

const AddRequestModal: React.FC<AddRequestModalProps> = ({
  onClose,
  endpoint = "/inventory/requests/create",
  refreshEndpoint = "/inventory/requests/all-records?status=pending",
}) => {
  const { searchStaff, createRequest } = useInventoryStore();
  const [formData, setFormData] = useState({
    requested_by: "", // card_id or staff_id
    first_name: "",
    last_name: "",
    item_name: "",
    category: "",
    quantity: "",
  });
  const [query, setQuery] = useState("");
  const [staffOptions, setStaffOptions] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced search function
  const handleSearch = debounce(async (val: string) => {
    console.log("handleSearch triggered with value:", val);
    const results = await searchStaff(val);
    console.log("handleSearch results:", results);
    setStaffOptions(results);
  }, 300);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name}=${value}`);
    if (name === "query") {
      setQuery(value);
      handleSearch(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle staff selection
  const handleSelectStaff = (staff: any) => {
    console.log("Selected staff:", staff);
    setSelectedStaff(staff);
    setFormData((prev) => ({
      ...prev,
      requested_by: staff.attributes.card_id || "",
      first_name: staff.attributes.first_name || "",
      last_name: staff.attributes.last_name || "",
    }));
    setQuery(`${staff.attributes.first_name} ${staff.attributes.last_name}`);
    setStaffOptions([]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log("Submitting formData:", formData);
    if (
      !formData.requested_by ||
      !formData.item_name ||
      !formData.category ||
      !formData.quantity
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        requested_by: formData.requested_by, // card_id
        inventory_id: formData.item_name, // Assuming item_name maps to inventory_id
        quantity: parseInt(formData.quantity),
        status: "pending",
      };
      const success = await createRequest(payload, endpoint, refreshEndpoint);
      if (success) {
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating request:", error);
      toast.error(error.response?.data?.message || "Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto p-12 h-[90%] w-full max-w-[980px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Request</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Staff Search */}
        <div className="mt-4 relative">
          <input
            type="search"
            name="query"
            value={query}
            onChange={handleChange}
            placeholder="Search staff by name or card ID..."
            className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
          />
          {staffOptions.length > 0 ? (
            <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
              {staffOptions.map((staff) => (
                <li
                  key={staff.id}
                  onClick={() => handleSelectStaff(staff)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {staff.attributes.first_name} {staff.attributes.last_name} —{" "}
                  {staff.attributes.card_id}
                </li>
              ))}
            </ul>
          ) : (
            query && (
              <p className="absolute z-20 w-full bg-white border rounded-lg mt-1 p-2 text-sm text-gray-500">
                No results found
              </p>
            )
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Card ID
            </label>
            <input
              type="text"
              name="requested_by"
              value={formData.requested_by}
              onChange={handleChange}
              disabled={!!selectedStaff}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!!selectedStaff}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!!selectedStaff}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Item Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
            >
              <option value="">Select Category</option>
              <option value="Syringe">Syringe</option>
              <option value="Bandage">Bandage</option>
              <option value="Medication">Medication</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Item Name
            </label>
            <select
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm appearance-none"
            >
              <option value="">Select Item</option>
              <option value="Syringe 5ml">Syringe 5ml</option>
              <option value="Bandage Roll">Bandage Roll</option>
              <option value="Paracetamol">Paracetamol</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="primary"
          >
            {" "}
            {isSubmitting ? "Adding..." : "Add Request"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRequestModal;
