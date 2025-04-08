import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface AddRequestModalProps {
  onClose: () => void;
  formData: {
    itemName: string;
    category: string;
    purchaseCost: string;
    quantity: string;
  };
}

const AddRequestModal: React.FC<AddRequestModalProps> = ({
  onClose,
  formData,
}) => {
  const [form, setForm] = useState(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        requested_by: 1, // Replace with the actual user ID
        status: "pending", // Default status
        inventory_id: parseInt(form.itemName), // Assuming itemName holds the inventory ID
        quantity: parseInt(form.quantity),
      };

      const response = await axios.post("/inventory/requests/create", payload);
      toast.success("Request created successfully!");
      onClose(); // Close the modal after successful submission
    } catch (error: any) {
      console.error("Error creating request:", error);
      toast.error(error.response?.data?.message || "Failed to create request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-lg font-semibold">Add Request</h2>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRequestModal;
