import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}
const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-lg custom-shadow overflow-y-auto w-full max-w-2xl h-[90%]">
          <div className="relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X className="text-black" />
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
