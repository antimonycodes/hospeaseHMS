import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Button from "../../../Shared/Button";
// import Button from "../../Shared/Button";

export const PatientActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
    <Link
      to="/dashboard/patients"
      className="flex items-center text-gray-600 hover:text-primary"
    >
      <ChevronLeft size={16} />
      <span className="ml-1">Patients</span>
    </Link>

    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <Button
        variant="edit"
        rounded="lg"
        onClick={onEdit}
        className="text-xs sm:text-sm flex-1 sm:flex-none"
      >
        Edit Patient
      </Button>
      <Button
        variant="delete"
        className="text-xs sm:text-sm flex-1 sm:flex-none"
        onClick={onDelete}
      >
        Delete Patient
      </Button>
    </div>
  </div>
);
