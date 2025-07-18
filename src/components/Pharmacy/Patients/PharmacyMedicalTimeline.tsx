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

// Custom component for displaying pharmacy items/drugs
export const PharmacyItemsList = ({ report }: { report: any }) => {
  if (!report.attributes.requested_pharmacy_items) return null;

  return (
    <div className="p-4 bg-gray-50 rounded-lg mt-2 mb-2">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        Selected Medications
      </h4>
      <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md">
        <span className="font-medium text-gray-700">
          {report.attributes.requested_items.item}
        </span>
        <span className="text-gray-500 text-sm">
          Qty: {report.attributes.requested_items.requested_quantity}
        </span>
      </div>
    </div>
  );
};

type MergedDataItem = {
  date: string;
  reports: any[];
  // notes: any[];
  isExpanded: boolean;
};

interface PharmacyMedicalTimelineProps {
  patientId: string;
  patient: any;
  showDownloadCompleteButton?: boolean;
  className?: string;
  externalMergedData?: MergedDataItem[]; // Optional prop to allow using external data
}

const PharmacyMedicalTimeline: React.FC<PharmacyMedicalTimelineProps> = ({
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

  // Filter function to only include pharmacy reports
  const filterPharmacyReports = (reports: any[]) => {
    return reports.filter(
      (report) =>
        report.attributes?.department?.name?.toLowerCase() === "pharmacy"
      //  &&
      //   report.attributes?.status === "pending"
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
        // await getMedicalNote(patientId, "pharmacy"); // Changed to fetch pharmacy notes if they exist
      } catch (error) {
        console.error("Error fetching timeline data:", error);
        toast.error("Failed to load pharmacy timeline");
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId, getAllReport, externalMergedData]);

  useEffect(() => {
    // Skip processing if using external data
    if (externalMergedData) return;

    if (allReports.length > 0 || allNotes.length > 0) {
      const processData = () => {
        // Filter to only include pharmacy reports
        const pharmacyReports = filterPharmacyReports(allReports);

        const groupedReports = groupByDate(pharmacyReports);
        // const groupedNotes = groupByDate(allNotes); // Assuming all notes are relevant

        const allDates = Array.from(
          new Set([
            ...Object.keys(groupedReports),
            // ...Object.keys(groupedNotes),
          ])
        );

        return allDates
          .map((date) => ({
            date,
            reports: groupedReports[date] || [],
            // notes: groupedNotes[date] || [],
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
      <div className={`mb-6 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Pharmacy Timeline
          </h3>
        </div>
        <div className="timeline-container bg-white p-6 rounded-lg custom-shadow text-center">
          <p className="text-gray-500">
            No pharmacy records found for this patient.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Pharmacy Timeline</h3>
        {showDownloadCompleteButton && mergedData.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                downloadCompletePDF(mergedData, patient);
              }}
              className="flex items-center gap-1 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition"
            >
              <Download size={16} />
              <span>Download Complete Report</span>
            </button>
          </div>
        )}
      </div>

      <div className="timeline-container bg-white p-6 rounded-lg custom-shadow">
        <div className="patient-report-header mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-primary mb-1">
            {patient?.first_name} {patient?.last_name} - Pharmacy Report
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <InfoRow label="Card ID" value={patient?.card_id} />
            <InfoRow label="Age" value={patient?.age?.toString()} />
            <InfoRow label="Gender" value={patient?.gender} />
            <InfoRow label="Phone" value={patient?.phone_number} />
          </div>
        </div>

        {mergedData?.map((day, index) => (
          <div
            key={day.date}
            className="timeline-day mb-4 border rounded-lg overflow-hidden bg-white"
          >
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
                onClick={() => toggleDateExpansion(index)}
              >
                <Calendar className="text-black w-5 h-5" />
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
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#CFFFE9] text-[#009952] px-2 py-1 rounded-full">
                  {day.reports.length} entries
                </span>
                {/* <div className="flex gap-1">
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
                    <Download size={14} />
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
                    <Printer size={14} />
                    <span>IMG</span>
                  </button>
                </div> */}
              </div>
            </div>

            {day.isExpanded && (
              <div className="p-4 space-y-4">
                {/* Timeline items with vertical connector */}
                <div className="relative timeline-items">
                  {[...day.reports]
                    .sort(
                      (a, b) =>
                        new Date(b.attributes.created_at).getTime() -
                        new Date(a.attributes.created_at).getTime()
                    )
                    .map((item, itemIdx) => {
                      const isReport = "case_report_id" in item;
                      return (
                        <div
                          key={isReport ? item.case_report_id : item.id}
                          className="timeline-item relative pl-8 pb-4 mb-4"
                        >
                          {/* Vertical line */}
                          {itemIdx !== [...day.reports].length - 1 && (
                            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                          )}

                          {/* Time dot */}
                          <div className="absolute left-0 top-0 bg-[#DFE0E0] rounded-full w-6 h-6 flex items-center justify-center">
                            <Clock className="text-white w-3 h-3" />
                          </div>

                          {/* Time */}
                          <div className="text-xs text-gray-500 mb-1">
                            {new Date(
                              item.attributes.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          {isReport ? (
                            <div className="bg-white border rounded-md p-4">
                              <ReportItem report={item} patientId={patientId} />
                            </div>
                          ) : (
                            <NoteItem note={item} />
                          )}
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

export default PharmacyMedicalTimeline;
