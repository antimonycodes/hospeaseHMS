// ReportPreviewModal.tsx
import React from "react";
import { X } from "lucide-react";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportContent: string;
}

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  reportContent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Report Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-auto flex-grow">
          <pre className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
            {reportContent}
          </pre>
        </div>
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
