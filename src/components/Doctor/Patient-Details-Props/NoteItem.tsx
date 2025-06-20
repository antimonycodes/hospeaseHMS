import { User } from "lucide-react";
import {
  FormattedReportNote,
  StructuredReportDisplay,
} from "../../../utils/noteUtils";

export const NoteItem = ({ note }: { note: any }) => {
  console.log("Note data:", note); // Add this line
  const staff = note.attributes.staff_details;
  const doctorName = note.attributes.doctor_name;
  const patientName = note.attributes.patient;
  const createdAt = note.attributes.created_at;
  const doctorNote = note.attributes.note;

  return (
    <div className="p-2 bg-white rounded-lg border-l-4 border border-blue-200 border-l-primary hover:shadow-md transition mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-3">
            <DoctorAvatar staff={staff} />
            <StaffInfo name={doctorName} role="Doctor" />
          </div>
          <h2 className="text-md font-semibold text-gray-800 mt-2">
            History & Evaluation
          </h2>
        </div>
        <div className="text-right">
          {/* <div className="text-sm text-gray-500">Patient: {patientName}</div> */}
          <div className="text-xs text-gray-400 mt-1">{createdAt}</div>
        </div>
      </div>

      {/* Doctor's Note Content */}
      <div className=" bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <FormattedReportNote note={doctorNote} />
        </div>
      </div>
    </div>
  );
};

const DoctorAvatar = ({ staff }: { staff: any }) => (
  <div className="bg-blue-100 p-2 rounded-full">
    {staff?.image ? (
      <img src={staff.image} alt="Doctor" className="w-6 h-6 rounded-full" />
    ) : (
      <User className="text-blue-600 w-5 h-5" />
    )}
  </div>
);

const StaffInfo = ({ name, role }: { name?: string; role: string }) => (
  <div>
    <p className="font-medium text-sm">{name || "Unknown Doctor"}</p>
    <p className="text-xs text-gray-500">{role}</p>
  </div>
);
