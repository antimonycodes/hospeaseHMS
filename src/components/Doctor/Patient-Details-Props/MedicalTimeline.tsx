import { Download } from "lucide-react";
// import { TimelineDay } from "./TimelineDay";
// import { downloadCompletePDF } from "../../utils/reportDownload";
import { InfoRow } from "./InfoRow";
import { TimelineDay } from "./TimelineDay";
import { downloadCompletePDF } from "../../../utils/reportDownload";

export const MedicalTimeline = ({
  mergedData,
  patient,
  toggleDateExpansion,
}: {
  mergedData: any[];
  patient: any;
  toggleDateExpansion: (index: number) => void;
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-800">Medical Timeline</h3>
      <div className="flex gap-2">
        <button
          onClick={() => downloadCompletePDF(mergedData, patient)}
          className="flex items-center gap-1 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition"
        >
          <Download size={16} />
          <span>Download Complete Report</span>
        </button>
      </div>
    </div>

    <div className="timeline-container bg-white p-6 rounded-lg custom-shadow">
      <ReportHeader patient={patient} />

      {mergedData.map((day, index) => (
        <TimelineDay
          key={day.date}
          day={day}
          index={index}
          patient={patient}
          toggleDateExpansion={toggleDateExpansion}
        />
      ))}
    </div>
  </div>
);

const ReportHeader = ({ patient }: { patient: any }) => (
  <div className="patient-report-header mb-6 border-b pb-4">
    <h2 className="text-xl font-bold text-primary mb-1">
      {patient.first_name} {patient.last_name} - Medical Report
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
      <InfoRow label="Patient ID" value={patient.card_id} />
      <InfoRow label="Age" value={patient.age?.toString()} />
      <InfoRow label="Gender" value={patient.gender} />
      <InfoRow label="Phone" value={patient.phone_number} />
    </div>
  </div>
);
