import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Printer,
  Download,
} from "lucide-react";
import {
  downloadDateReportAsImage,
  downloadDateReportAsPDF,
} from "../../../utils/reportDownload";
import { ReportItem } from "./ReportItem";
import { NoteItem } from "./NoteItem";
// import {
//   downloadDateReportAsPDF,
//   downloadDateReportAsImage,
// } from "../../utils/reportDownload";
// import { ReportItem } from "./ReportItem";
// import { NoteItem } from "./NoteItem";

export const TimelineDay = ({
  day,
  index,
  patient,
  toggleDateExpansion,
}: {
  day: any;
  index: number;
  patient: any;
  toggleDateExpansion: (index: number) => void;
}) => (
  <div className="timeline-day mb-4 border rounded-lg overflow-hidden bg-white">
    <DayHeader
      day={day}
      index={index}
      toggleExpansion={toggleDateExpansion}
      patient={patient}
    />

    {day.isExpanded && (
      <div className="p-4 space-y-4">
        <div className="relative timeline-items">
          {[...day.reports, ...day.notes]
            .sort(
              (a, b) =>
                new Date(b.attributes.created_at).getTime() -
                new Date(a.attributes.created_at).getTime()
            )
            .map((item: any, itemIdx: number) => (
              <TimelineEntry
                key={item.id}
                item={item}
                itemIdx={itemIdx}
                totalItems={[...day.reports, ...day.notes].length}
              />
            ))}
        </div>
      </div>
    )}
  </div>
);

const DayHeader = ({
  day,
  index,
  toggleExpansion,
  patient,
}: {
  day: any;
  index: number;
  toggleExpansion: (index: number) => void;
  patient: any;
}) => (
  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
      onClick={() => toggleExpansion(index)}
    >
      <Calendar className="text-blue-600 w-5 h-5" />
      <h3 className="font-medium text-gray-700">
        {new Date(day.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h3>
      {day.isExpanded ? (
        <ChevronUp className="text-gray-500 w-5 h-5" />
      ) : (
        <ChevronDown className="text-gray-500 w-5 h-5" />
      )}
    </div>
    <DayDownloadButtons day={day} patient={patient} />
  </div>
);

const DayDownloadButtons = ({ day, patient }: any) => (
  <div className="flex items-center gap-2">
    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
      {day.reports.length + day.notes.length} entries
    </span>
    <div className="flex gap-1">
      <DownloadButton
        label="PDF"
        onClick={() => downloadDateReportAsPDF(day, patient)}
        icon={<Download size={14} />}
      />
      <DownloadButton
        label="IMG"
        onClick={() => downloadDateReportAsImage(day, patient)}
        icon={<Printer size={14} />}
      />
    </div>
  </div>
);

const DownloadButton = ({ label, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md hover:bg-gray-600"
  >
    {icon}
    <span>{label}</span>
  </button>
);

const TimelineEntry = ({ item, itemIdx, totalItems }: any) => {
  const isReport = "case_report_id" in item;
  const time = new Date(item.attributes.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="timeline-item relative pl-8 pb-4 mb-4">
      {itemIdx !== totalItems - 1 && (
        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
      )}

      <div className="absolute left-0 top-0 bg-[#DFE0E0] rounded-full w-6 h-6 flex items-center justify-center">
        <Clock className="text-white w-3 h-3" />
      </div>

      <div className="text-xs text-gray-500 mb-1">{time}</div>

      {isReport ? (
        <ReportItem report={item} patientId={""} />
      ) : (
        <NoteItem note={item} />
      )}
    </div>
  );
};
