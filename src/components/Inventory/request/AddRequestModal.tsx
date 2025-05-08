import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import Button from "../../../Shared/Button";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

interface AddRequestModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
  fetchEndpoint: string;
  stockEndpoint: string;
}

const AddRequestModal: React.FC<AddRequestModalProps> = ({
  onClose,
  endpoint,
  refreshEndpoint,
  fetchEndpoint,
  stockEndpoint,
}) => {
  const { createRequest, getAllStocks, stocks, isLoading } =
    useInventoryStore();
  const { allStaffs, getAllStaffs } = useGlobalStore();
  const { getAllRoles, roles } = useGlobalStore();

  const [formData, setFormData] = useState({
    requested_by: "",
    requested_department_id: "",
    first_name: "",
    last_name: "",
    item_name: "",
    quantity: "",
  });

  const [requestedType, setRequestedType] = useState<"staff" | "department">(
    "staff"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  // Custom styles for React Select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      padding: "0.5rem",
      borderColor: "#D0D5DD",
      borderRadius: "0.375rem",
    }),
  };

  useEffect(() => {
    getAllRoles();
    getAllStocks(stockEndpoint);
    getAllStaffs();
  }, [getAllRoles, getAllStocks, getAllStaffs, stockEndpoint, fetchEndpoint]);

  console.log(allStaffs, "allStaffs");
  const handleDepartmentSelect = (option: any) => {
    if (!option) {
      setFormData((prev) => ({
        ...prev,
        requested_department_id: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      requested_department_id: option.value,
      requested_by: "",
      first_name: "",
      last_name: "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestTypeChange = (type: "staff" | "department") => {
    setRequestedType(type);
    setFormData((prev) => ({
      ...prev,
      requested_by: "",
      requested_department_id: "",
      first_name: "",
      last_name: "",
    }));
    setSelectedStaff(null);
  };

  const handleSubmit = async () => {
    if (
      !formData.item_name ||
      !formData.quantity ||
      (requestedType === "staff" && !formData.requested_by) ||
      (requestedType === "department" && !formData.requested_department_id)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        requested_by: requestedType === "staff" ? formData.requested_by : null,
        requested_department_id:
          requestedType === "department"
            ? formData.requested_department_id
            : null,
        inventory_id: formData.item_name,
        quantity: parseInt(formData.quantity),
        status: "approved",
      };

      const success = await createRequest(payload, endpoint, refreshEndpoint);
      if (success) onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentOptions = Object.values(roles).map((dept) => ({
    value: dept.id,
    label: dept.role,
  }));

  return (
    <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-y-auto p-12 h-[90%] w-full max-w-[980px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Request</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Request Type Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-custom-black mb-2">
            Request Type
          </label>
          <div className="flex space-x-4">
            <div
              className={`px-4 py-2 rounded-md cursor-pointer border ${
                requestedType === "staff"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => handleRequestTypeChange("staff")}
            >
              Staff
            </div>
            <div
              className={`px-4 py-2 rounded-md cursor-pointer border ${
                requestedType === "department"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => handleRequestTypeChange("department")}
            >
              Department
            </div>
          </div>
        </div>

        {/* Staff or Department */}
        {requestedType === "staff" ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-custom-black mb-1">
              Select Staff
            </label>
            <Select
              styles={customStyles}
              options={allStaffs.map((person) => ({
                label: `${person.attributes.first_name} ${person.attributes.last_name}`,
                value: person.id,
              }))}
              isDisabled={isLoading}
              onChange={(selected) => {
                const selectedPerson = allStaffs.find(
                  (person) => person.id === selected?.value
                );
                if (selectedPerson) {
                  setSelectedStaff(selectedPerson);
                  setFormData((prev) => ({
                    ...prev,
                    requested_by: selectedPerson.id,
                    requested_department_id: "",
                    first_name: selectedPerson.attributes.first_name || "",
                    last_name: selectedPerson.attributes.last_name || "",
                  }));
                } else {
                  setSelectedStaff(null);
                  setFormData((prev) => ({
                    ...prev,
                    requested_by: "",
                    first_name: "",
                    last_name: "",
                  }));
                }
              }}
            />
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-custom-black mb-1">
              Select Department
            </label>
            <Select
              styles={customStyles}
              classNamePrefix="react-select"
              placeholder="Select a department"
              isClearable
              options={departmentOptions}
              onChange={handleDepartmentSelect}
              noOptionsMessage={() => "No departments found"}
            />
          </div>
        )}

        {/* Staff Info */}
        {requestedType === "staff" && selectedStaff && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-custom-black mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                disabled
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
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
                disabled
                className="w-full p-4 border border-[#D0D5DD] rounded-md text-sm bg-gray-100"
              />
            </div>
          </div>
        )}

        {/* Item and Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-custom-black mb-1">
              Item Name
            </label>
            <Select
              styles={customStyles}
              options={stocks.map((stock) => ({
                label: stock.attributes.service_item_name,
                value: stock.id,
              }))}
              isDisabled={isLoading}
              onChange={(selected) => {
                const selectedItem = stocks.find(
                  (stock) => stock.id === selected?.value
                );
                if (selectedItem) {
                  setSelectedStock(selectedItem);
                  setFormData((prev) => ({
                    ...prev,
                    item_name: selectedItem.id.toString(),
                  }));
                } else {
                  setSelectedStock(null);
                  setFormData((prev) => ({
                    ...prev,
                    item_name: "",
                  }));
                }
              }}
            />
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

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="primary"
          >
            {isSubmitting ? "Adding..." : "Add Request"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRequestModal;
