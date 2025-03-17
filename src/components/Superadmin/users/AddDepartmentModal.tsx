import { X } from "lucide-react";

const AddDepartmentModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1E1E1E40] px-6 ">
      <div className="bg-white w-full max-w-3xl p-6 shadow-lg h-[90%] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-lg font-semibold">Add New Admin</h2>
          <button onClick={onClose} className="text-black">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
