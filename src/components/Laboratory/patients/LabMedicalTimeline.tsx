import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Download,
  Printer,
  Clock,
} from "lucide-react";
import {
  downloadDateReportAsPDF,
  downloadDateReportAsImage,
  downloadCompletePDF,
} from "../../../utils/reportDownload";
import toast from "react-hot-toast";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import Loader from "../../../Shared/Loader";
import { ReportItem } from "../../../components/Doctor/Patient-Details-Props/ReportItem";
import { NoteItem } from "../../../components/Doctor/Patient-Details-Props/NoteItem";

// Reusable Component for Patient Info
export const InfoRow = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | null;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);

type MergedDataItem = {
  date: string;
  reports: any[];
  notes: any[];
  isExpanded: boolean;
};

interface LabMedicalTimelineProps {
  patientId: string;
  patient: any;
  showDownloadCompleteButton?: boolean;
  className?: string;
  externalMergedData?: MergedDataItem[]; // Optional prop to allow using external data
}

const LabMedicalTimeline: React.FC<LabMedicalTimelineProps> = ({
  patientId,
  patient,
  showDownloadCompleteButton = true,
  className = "",
  externalMergedData,
}) => {
  const [mergedData, setMergedData] = useState<MergedDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getAllReport, allReports, getMedicalNote, allNotes } =
    useReportStore();

  // Group data by date utility function
  const groupByDate = (data: any[]) => {
    return data.reduce((acc: { [key: string]: any[] }, item) => {
      const rawDate = new Date(item.attributes?.created_at);
      const date = rawDate.toLocaleDateString("en-CA"); // Format: yyyy-mm-dd (ISO format but local)
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  // Filter function to only include laboratory reports
  const filterLabReports = (reports: any[]) => {
    return reports.filter(
      (report) => report.attributes?.department?.name === "Laboratory"
    );
  };

  useEffect(() => {
    // If external data is provided, use it
    if (externalMergedData) {
      setMergedData(externalMergedData);
      return;
    }

    // Otherwise, fetch and process the data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getAllReport(patientId);
        await getMedicalNote(patientId, "laboratory"); // Changed to fetch lab notes if they exist
      } catch (error) {
        console.error("Error fetching timeline data:", error);
        toast.error("Failed to load laboratory timeline");
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId, getAllReport, getMedicalNote, externalMergedData]);

  useEffect(() => {
    // Skip processing if using external data
    if (externalMergedData) return;

    if (allReports.length > 0 || allNotes.length > 0) {
      const processData = () => {
        // Filter to only include lab reports
        const labReports = filterLabReports(allReports);

        const groupedReports = groupByDate(labReports);
        const groupedNotes = groupByDate(allNotes); // Assuming all notes are relevant

        const allDates = Array.from(
          new Set([
            ...Object.keys(groupedReports),
            ...Object.keys(groupedNotes),
          ])
        );

        return allDates
          .map((date) => ({
            date,
            reports: groupedReports[date] || [],
            notes: groupedNotes[date] || [],
            isExpanded: true, // Set initially expanded
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      };

      setMergedData(processData());
    }
  }, [allReports, allNotes, externalMergedData]);

  const toggleDateExpansion = (index: number) => {
    const updatedData = [...mergedData];
    updatedData[index].isExpanded = !updatedData[index].isExpanded;
    setMergedData(updatedData);
  };

  if (isLoading) return <Loader />;

  if (mergedData.length === 0) {
    return (
      <div className={`mb-4 sm:mb-6 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="text-lg font-medium text-gray-800">
            Laboratory Timeline
          </h3>
        </div>
        <div className="timeline-container bg-white p-4 sm:p-6 rounded-lg custom- text-center">
          <p className="text-gray-500">
            No laboratory records found for this patient.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 sm:mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h3 className="text-lg font-medium text-gray-800">
          Laboratory Timeline
        </h3>
        {showDownloadCompleteButton && mergedData.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                downloadCompletePDF(mergedData, patient);
              }}
              className="flex items-center gap-1 text-xs sm:text-sm bg-primary text-white px-2 sm:px-3 py-1.5 rounded-md hover:bg-primary/90 transition"
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Download Complete Report</span>
              <span className="sm:hidden">Complete PDF</span>
            </button>
          </div>
        )}
      </div>

      <div className="timeline-container bg-white p-3 sm:p-6 rounded-lg custom-shadow">
        <div className="patient-report-header mb-4 sm:mb-6 border-b pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-1 leading-tight">
            {patient?.first_name} {patient?.last_name} - Laboratory Report
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3">
            <InfoRow label="Card ID" value={patient?.card_id} />
            <InfoRow label="Age" value={patient?.age?.toString()} />
            <InfoRow label="Gender" value={patient?.gender} />
            <InfoRow label="Phone" value={patient?.phone_number} />
          </div>
        </div>

        {mergedData?.map((day, index) => (
          <div
            key={day.date}
            className="timeline-day mb-3 sm:mb-4 border rounded-lg overflow-hidden bg-white"
          >
            <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md -mx-2"
                onClick={() => toggleDateExpansion(index)}
              >
                <Calendar className="text-black w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <h3 className="font-medium text-gray-700 text-sm sm:text-base">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                {day.isExpanded ? (
                  <ChevronUp className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-xs bg-[#CFFFE9] text-[#009952] px-2 py-1 rounded-full whitespace-nowrap">
                  {day.reports.length + day.notes.length} entries
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      toast.loading("Generating PDF...", { id: "date-pdf" });
                      downloadDateReportAsPDF(day, patient)
                        .then(() =>
                          toast.success("PDF downloaded", { id: "date-pdf" })
                        )
                        .catch(() =>
                          toast.error("Failed to download PDF", {
                            id: "date-pdf",
                          })
                        );
                    }}
                    className="flex items-center gap-1 text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-700"
                    title="Download as PDF"
                  >
                    <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      toast.loading("Generating image...", {
                        id: "date-img",
                      });
                      downloadDateReportAsImage(day, patient)
                        .then(() =>
                          toast.success("Image downloaded", {
                            id: "date-img",
                          })
                        )
                        .catch(() =>
                          toast.error("Failed to download image", {
                            id: "date-img",
                          })
                        );
                    }}
                    className="flex items-center gap-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                    title="Download as Image"
                  >
                    <Printer size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>IMG</span>
                  </button>
                </div>
              </div>
            </div>

            {day.isExpanded && (
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Timeline items with vertical connector */}
                <div className="relative timeline-items">
                  {[...day.reports, ...day.notes]
                    .sort(
                      (a, b) =>
                        new Date(b.attributes.created_at).getTime() -
                        new Date(a.attributes.created_at).getTime()
                    )
                    .map((item, itemIdx) => {
                      const isReport = "case_report_id" in item;
                      const isLast =
                        itemIdx === [...day.reports, ...day.notes].length - 1;

                      return (
                        <div
                          key={isReport ? item.case_report_id : item.id}
                          className="timeline-item relative pl-6 sm:pl-8 pb-3 sm:pb-4 mb-3 sm:mb-4"
                        >
                          {/* Vertical line */}
                          {!isLast && (
                            <div className="absolute left-2.5 sm:left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                          )}

                          {/* Time dot */}
                          <div className="absolute left-0 top-0 bg-[#DFE0E0] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                            <Clock className="text-white w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </div>

                          {/* Time */}
                          <div className="text-xs text-gray-500 mb-1 sm:mb-2">
                            {new Date(
                              item.attributes.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          <div className="min-w-0">
                            {" "}
                            {/* Prevent overflow */}
                            {isReport ? (
                              <ReportItem report={item} patientId={patientId} />
                            ) : (
                              <NoteItem note={item} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabMedicalTimeline;
