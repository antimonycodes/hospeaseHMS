import { useState, useEffect } from "react";
import { Modal, Button, Input, DatePicker } from "antd";
import toast from "react-hot-toast";
// import { toast } from "react-toastify";

interface UpdateStockModalProps {
  visible: boolean;
  onClose: () => void;
  stockItem: {
    id: string | number;
    cost?: number;
    quantity?: number;
    expiry_date?: string;
    item?: string;
  };
  onUpdate: (
    id: string | number,
    formData: { cost: number; quantity: number; expiry_date: string }
  ) => Promise<boolean>;
  isLoading: boolean;
}

const UpdateStockModal = ({
  visible,
  onClose,
  stockItem,
  onUpdate,
  isLoading,
}: UpdateStockModalProps) => {
  const [formData, setFormData] = useState({
    cost: 0,
    quantity: 0,
    expiry_date: "",
  });

  useEffect(() => {
    if (stockItem) {
      setFormData({
        cost: stockItem.cost || 0,
        quantity: stockItem.quantity || 0,
        expiry_date: stockItem.expiry_date || "",
      });
    }
  }, [stockItem]);

  const handleSubmit = async () => {
    // if (!formData.cost || !formData.quantity || !formData.expiry_date) {
    //   toast.error("Please fill all fields");
    //   return;
    // }

    const success = await onUpdate(stockItem.id, formData);
    // const success = await onUpdate(stockItem.id, formData, stockItem);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      title={`Update ${stockItem?.item || "Stock"}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          color="danger"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Update Stock
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost Price
          </label>
          <Input
            type="number"
            value={formData.cost}
            onChange={(e) =>
              setFormData({
                ...formData,
                cost: parseFloat(e.target.value) || 0,
              })
            }
            prefix="₦"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <Input
            type="date"
            value={formData.expiry_date}
            onChange={(e) =>
              setFormData({ ...formData, expiry_date: e.target.value })
            }
          />
        </div> */}
      </div>
    </Modal>
  );
};

export default UpdateStockModal;
