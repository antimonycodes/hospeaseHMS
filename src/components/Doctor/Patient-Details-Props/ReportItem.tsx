import { FileText, User } from "lucide-react";

export const ReportItem = ({ report }: { report: any }) => {
  const staff = report.attributes.staff_details;
  const department = report.attributes.department?.name || "Unknown Department";

  return (
    <div className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <StaffAvatar staff={staff} />
          <StaffInfo
            name={`${staff?.first_name} ${staff?.last_name}`}
            role={department}
          />
        </div>
        <StatusBadge status={report.attributes.status} />
      </div>

      <p className="text-sm text-gray-600 mb-2">{report.attributes.note}</p>
      {report.attributes.file && (
        <FileAttachment url={report.attributes.file} />
      )}
    </div>
  );
};

const StaffAvatar = ({ staff }: { staff: any }) => (
  <div className="bg-gray-100 p-2 rounded-full">
    {staff?.image ? (
      <img src={staff.image} alt="Staff" className="w-6 h-6 rounded-full" />
    ) : (
      <User className="text-white w-5 h-5" />
    )}
  </div>
);

const StaffInfo = ({ name, role }: { name: string; role: string }) => (
  <div>
    <p className="font-medium text-sm">{name}</p>
    <p className="text-xs text-gray-500">{role}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`text-xs px-2 py-1 rounded-full ${
      status === "completed" || status === "sent"
        ? "bg-[#CCFFE7] text-[#009952]"
        : "bg-[#FFEBAA] text-[#B58A00]"
    }`}
  >
    {status}
  </span>
);

const FileAttachment = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center text-blue-600 text-sm hover:underline"
  >
    <FileText className="w-4 h-4 mr-2" />
    View Attachment
  </a>
);
