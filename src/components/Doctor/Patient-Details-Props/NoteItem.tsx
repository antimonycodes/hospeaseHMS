import { User } from "lucide-react";
import { StructuredReportDisplay } from "../../../utils/noteUtils";

export const NoteItem = ({ note }: { note: any }) => {
  const staff = note.attributes.staff_details;
  const doctorname = note.attributes.doctor_name;

  return (
    <div className="p-4 bg-white rounded-lg border-l-4 border border-blue-200 border-l-primary hover:shadow-md transition">
      <h1>History & Evaluation</h1>
      <div className=" flex justify-between">
        <div className="flex items-center gap-3 mb-3">
          <DoctorAvatar staff={staff} />
          <StaffInfo name={doctorname} role="" />
        </div>
        {/*  */}
        <div>Date</div>
      </div>
      <p className="text-sm text-gray-600">
        <StructuredReportDisplay note={note.attributes.note} />
      </p>
    </div>
  );
};

const DoctorAvatar = ({ staff }: { staff: any }) => (
  <div className="bg-blue-100 p-2 rounded-full">
    {staff?.image ? (
      <img src={staff.image} alt="Staff" className="w-6 h-6 rounded-full" />
    ) : (
      <User className="text-white w-5 h-5" />
    )}
  </div>
);

// Reuse StaffInfo component from ReportItem.tsx
const StaffInfo = ({ name, role }: { name?: string; role: string }) => (
  <div>
    <p className="font-medium text-sm">{name}</p>
    <p className="text-xs text-gray-500">{role}</p>
  </div>
);
