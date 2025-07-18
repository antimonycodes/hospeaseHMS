// import { useEffect, useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   Calendar,
//   Download,
//   Printer,
//   Clock,
// } from "lucide-react";
// import {
//   downloadDateReportAsPDF,
//   downloadDateReportAsImage,
//   downloadCompletePDF,
// } from "../utils/reportDownload";
// import toast from "react-hot-toast";
// import { useReportStore } from "../store/super-admin/useReoprt";
// import Loader from "./Loader";
// import { ReportItem } from "../components/Doctor/Patient-Details-Props/ReportItem";
// import { NoteItem } from "../components/Doctor/Patient-Details-Props/NoteItem";
// import { useCombinedStore } from "../store/super-admin/useCombinedStore";
// import PaymentModal from "../components/Frontdesk/payment/PaymentModal";

// // Reusable Component for Patient Info
// export const InfoRow = ({
//   label,
//   value,
//   className = "",
// }: {
//   label: string;
//   value?: string | null;
//   className?: string;
// }) => (
//   <div className={className}>
//     <p className="text-xs text-gray-500">{label}</p>
//     <p className="text-sm font-medium truncate">{value || "N/A"}</p>
//   </div>
// );

// type MergedDataItem = {
//   date: string;
//   reports: any[];
//   notes: any[];
//   isExpanded: boolean;
// };

// interface MedicalTimelineProps {
//   patientId: string;
//   patient: any;
//   showDownloadCompleteButton?: boolean;
//   className?: string;
//   externalMergedData?: MergedDataItem[];
// }

// const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
//   patientId,
//   patient,
//   showDownloadCompleteButton = true,
//   className = "",
//   externalMergedData,
// }) => {
//   const [mergedData, setMergedData] = useState<MergedDataItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const { getAllReport, allReports, getMedicalNote, allNotes } =
//     useReportStore();
//   const { openPaymentModal, isPaymentModalOpen, paymentData } =
//     useCombinedStore();
//   console.log(allNotes, "notessss");

//   const groupByDate = (data: any[]) => {
//     console.log("Grouping data:", data); // Debug log
//     return data.reduce((acc: { [key: string]: any[] }, item) => {
//       // Handle both report and note date formats
//       let dateStr = item.attributes?.created_at;

//       // Parse the date string and convert to YYYY-MM-DD format
//       let date: string;
//       try {
//         // Handle different date formats
//         if (dateStr.includes(",")) {
//           // Format: "Jul 05, 2025 06:54 AM"
//           const dateObj = new Date(dateStr);
//           date = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD format
//         } else {
//           // Fallback for other formats
//           const dateObj = new Date(dateStr);
//           date = dateObj.toLocaleDateString("en-CA");
//         }
//       } catch (error) {
//         console.error("Error parsing date:", dateStr, error);
//         date = new Date().toLocaleDateString("en-CA"); // fallback to today
//       }

//       if (!acc[date]) acc[date] = [];
//       acc[date].push(item);
//       return acc;
//     }, {});
//   };

//   const separateNotesAndReports = (data: any[]) => {
//     const notes: any[] = [];
//     const reports: any[] = [];

//     data.forEach((item) => {
//       if (item.type === "Doctor Report") {
//         notes.push(item);
//       } else if (item.type === "Case Report") {
//         reports.push(item);
//       }
//     });

//     return { notes, reports };
//   };

//   useEffect(() => {
//     // if (externalMergedData) {
//     //   setMergedData(externalMergedData);
//     //   return;
//     // }

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         console.log("Fetching data for patient:", patientId);
//         await getAllReport(patientId);
//         await getMedicalNote(patientId, "doctor");
//         await getMedicalNote(patientId, "consultant");
//         await getMedicalNote(patientId, "medical-director");
//       } catch (error) {
//         console.error("Error fetching timeline data:", error);
//         toast.error("Failed to load medical timeline");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (patientId) {
//       fetchData();
//     }
//   }, [patientId, getAllReport, getMedicalNote, externalMergedData]);

//   useEffect(() => {
//     if (externalMergedData) return;

//     console.log("Processing reports:", allReports);
//     console.log("Processing notes:", allNotes);

//     // Check if we have any data at all
//     const hasData = allReports.length > 0 || allNotes.length > 0;

//     if (hasData) {
//       const processData = () => {
//         // Combine all data first
//         const allData = [...allReports, ...allNotes];
//         console.log("Combined data:", allData);

//         // Separate notes and reports based on type
//         const { notes, reports } = separateNotesAndReports(allData);
//         console.log("Separated notes:", notes);
//         console.log("Separated reports:", reports);

//         // Group by date
//         const groupedReports = groupByDate(reports);
//         const groupedNotes = groupByDate(notes);

//         console.log("Grouped reports:", groupedReports);
//         console.log("Grouped notes:", groupedNotes);

//         const allDates = Array.from(
//           new Set([
//             ...Object.keys(groupedReports),
//             ...Object.keys(groupedNotes),
//           ])
//         );

//         console.log("All dates:", allDates);

//         const processedData = allDates
//           .map((date) => ({
//             date,
//             reports: groupedReports[date] || [],
//             notes: groupedNotes[date] || [],
//             isExpanded: true,
//           }))
//           .sort(
//             (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//           );

//         console.log("Processed data:", processedData);
//         return processedData;
//       };

//       setMergedData(processData());
//     }
//   }, [allReports, allNotes, externalMergedData, patientId]);

//   const toggleDateExpansion = (index: number) => {
//     const updatedData = [...mergedData];
//     updatedData[index].isExpanded = !updatedData[index].isExpanded;
//     setMergedData(updatedData);
//   };

//   if (isLoading) return <Loader />;

//   if (mergedData.length === 0) {
//     return (
//       <div className={`mb-6 ${className}`}>
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-medium text-gray-800">
//             Medical Timeline
//           </h3>
//         </div>
//         <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
//           <p className="text-gray-500">
//             No medical records found for this patient.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`mb-6 ${className}`}>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//         <h3 className="text-lg font-medium text-gray-800">Medical Timeline</h3>
//         {showDownloadCompleteButton && mergedData.length > 0 && (
//           <button
//             onClick={() => downloadCompletePDF(mergedData, patient)}
//             className="flex items-center gap-1 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition w-full sm:w-auto justify-center"
//           >
//             <Download size={16} />
//             <span>Download Complete Report</span>
//           </button>
//         )}
//       </div>

//       <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
//         <div className="patient-report-header mb-6 border-b pb-4">
//           <h2 className="text-lg md:text-xl font-bold text-primary mb-2">
//             {patient.first_name} {patient.last_name} - Medical Report
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3">
//             <InfoRow label="Card ID" value={patient.card_id} />
//             <InfoRow label="Age" value={patient.age?.toString()} />
//             <InfoRow label="Gender" value={patient.gender} />
//             <InfoRow label="Phone" value={patient.phone_number} />
//           </div>
//         </div>

//         <div className="space-y-3">
//           {mergedData?.map((day, index) => (
//             <div
//               key={day.date}
//               className="border border-gray-200 rounded-lg overflow-hidden bg-white"
//             >
//               <div className="p-3 md:p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                 <button
//                   className="flex items-center gap-2 w-full sm:w-auto hover:bg-gray-100 px-2 py-1 rounded-md"
//                   onClick={() => toggleDateExpansion(index)}
//                 >
//                   <Calendar className="text-gray-600 w-4 h-4 md:w-5 md:h-5" />
//                   <h3 className="font-medium text-gray-700 text-sm md:text-base">
//                     {new Date(day.date).toLocaleDateString("en-US", {
//                       weekday: "long",
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </h3>
//                   {day.isExpanded ? (
//                     <ChevronUp className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
//                   ) : (
//                     <ChevronDown className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
//                   )}
//                 </button>

//                 <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
//                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
//                     {day.reports.length + day.notes.length} entries
//                   </span>
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => {
//                         toast.loading("Generating PDF...", { id: "date-pdf" });
//                         downloadDateReportAsPDF(day, patient)
//                           .then(() =>
//                             toast.success("PDF downloaded", { id: "date-pdf" })
//                           )
//                           .catch(() =>
//                             toast.error("Failed to download PDF", {
//                               id: "date-pdf",
//                             })
//                           );
//                       }}
//                       className="flex items-center gap-1 text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-700 whitespace-nowrap"
//                       title="Download as PDF"
//                     >
//                       <Download size={12} className="hidden xs:inline" />
//                       <span>PDF</span>
//                     </button>
//                     <button
//                       onClick={() => {
//                         toast.loading("Generating image...", {
//                           id: "date-img",
//                         });
//                         downloadDateReportAsImage(day, patient)
//                           .then(() =>
//                             toast.success("Image downloaded", {
//                               id: "date-img",
//                             })
//                           )
//                           .catch(() =>
//                             toast.error("Failed to download image", {
//                               id: "date-img",
//                             })
//                           );
//                       }}
//                       className="flex items-center gap-1 text-xs bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 whitespace-nowrap"
//                       title="Download as Image"
//                     >
//                       <Printer size={12} className="hidden xs:inline" />
//                       <span>IMG</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {day.isExpanded && (
//                 <div className="p-2 space-y-3">
//                   {[...day.reports, ...day.notes]
//                     .sort((a, b) => {
//                       // Handle different date formats for sorting
//                       const dateA = new Date(a.attributes.created_at);
//                       const dateB = new Date(b.attributes.created_at);
//                       return dateB.getTime() - dateA.getTime();
//                     })
//                     .map((item, itemIdx) => {
//                       // Correct way to determine if it's a report or note
//                       // Notes have type: "Doctor Report"
//                       // Reports have type: "Case Report"
//                       const isReport =
//                         item.type === "Case Report" ||
//                         item.case_report_id !== undefined;
//                       const isNote = item.type === "Doctor Report";

//                       console.log(
//                         "Item type:",
//                         item.type,
//                         "isReport:",
//                         isReport,
//                         "isNote:",
//                         isNote,
//                         item
//                       );

//                       return (
//                         <div
//                           key={
//                             isReport ? item.case_report_id || item.id : item.id
//                           }
//                           className="relative pl-6 pb-3"
//                         >
//                           {itemIdx !==
//                             [...day.reports, ...day.notes].length - 1 && (
//                             <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
//                           )}

//                           <div className="absolute left-0 top-0 bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center">
//                             <Clock className="text-white w-2.5 h-2.5" />
//                           </div>

//                           <div className="text-xs text-gray-500 mb-1">
//                             {new Date(
//                               item.attributes.created_at
//                             ).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </div>

//                           {isReport ? (
//                             <ReportItem report={item} patientId={patientId} />
//                           ) : isNote ? (
//                             <NoteItem note={item} />
//                           ) : (
//                             <div className="text-gray-500 italic">
//                               Unknown item type: {item.type}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {isPaymentModalOpen && (
//         <PaymentModal
//           patientId={patientId}
//           paymentData={paymentData}
//           firstName={patient?.first_name}
//           lastName={patient?.last_name}
//           cardId={patient.card_id}
//         />
//       )}
//     </div>
//   );
// };

// export default MedicalTimeline;
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
} from "../utils/reportDownload";
import toast from "react-hot-toast";
import { useReportStore } from "../store/super-admin/useReoprt";
import Loader from "./Loader";
import { ReportItem } from "../components/Doctor/Patient-Details-Props/ReportItem";
import { NoteItem } from "../components/Doctor/Patient-Details-Props/NoteItem";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";
import PaymentModal from "../components/Frontdesk/payment/PaymentModal";

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
    <p className="text-sm font-medium truncate">{value || "N/A"}</p>
  </div>
);

type MergedDataItem = {
  date: string;
  reports: any[];
  notes: any[];
  isExpanded: boolean;
};

interface MedicalTimelineProps {
  patientId: string;
  patient: any;
  showDownloadCompleteButton?: boolean;
  className?: string;
  externalMergedData?: MergedDataItem[];
}

const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
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
  const { openPaymentModal, isPaymentModalOpen, paymentData } =
    useCombinedStore();
  console.log(allNotes, "notessss");

  // Helper function to create patient full name for comparison
  const createPatientFullName = (patient: any) => {
    if (!patient) return "";
    const firstName = patient.first_name || "";
    const lastName = patient.last_name || "";
    return `${firstName} ${lastName}`.trim().toUpperCase();
  };

  // Helper function to normalize names for comparison
  const normalizePatientName = (name: string) => {
    if (!name) return "";
    return name.trim().toUpperCase();
  };

  // Filter function to check if a note belongs to the current patient
  const filterNotesByPatient = (notes: any[], currentPatient: any) => {
    if (!currentPatient) return notes;

    const currentPatientName = createPatientFullName(currentPatient);
    console.log("Current patient name for filtering:", currentPatientName);

    return notes.filter((note) => {
      const notePatientName = normalizePatientName(
        note.attributes?.patient || ""
      );
      console.log(
        "Note patient name:",
        notePatientName,
        "Current patient:",
        currentPatientName
      );

      // Check if the note's patient name matches the current patient
      const isMatch = notePatientName === currentPatientName;
      console.log("Name match:", isMatch);

      return isMatch;
    });
  };

  const groupByDate = (data: any[]) => {
    console.log("Grouping data:", data); // Debug log
    return data.reduce((acc: { [key: string]: any[] }, item) => {
      // Handle both report and note date formats
      let dateStr = item.attributes?.created_at;

      // Parse the date string and convert to YYYY-MM-DD format
      let date: string;
      try {
        // Handle different date formats
        if (dateStr.includes(",")) {
          // Format: "Jul 05, 2025 06:54 AM"
          const dateObj = new Date(dateStr);
          date = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD format
        } else {
          // Fallback for other formats
          const dateObj = new Date(dateStr);
          date = dateObj.toLocaleDateString("en-CA");
        }
      } catch (error) {
        console.error("Error parsing date:", dateStr, error);
        date = new Date().toLocaleDateString("en-CA"); // fallback to today
      }

      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  const separateNotesAndReports = (data: any[]) => {
    const notes: any[] = [];
    const reports: any[] = [];

    data.forEach((item) => {
      if (item.type === "Doctor Report") {
        notes.push(item);
      } else if (item.type === "Case Report") {
        reports.push(item);
      }
    });

    return { notes, reports };
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching data for patient:", patientId);
        await getAllReport(patientId);
        await getMedicalNote(patientId, "doctor");
        await getMedicalNote(patientId, "consultant");
        await getMedicalNote(patientId, "medical-director");
      } catch (error) {
        console.error("Error fetching timeline data:", error);
        toast.error("Failed to load medical timeline");
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId, getAllReport, getMedicalNote, externalMergedData]);

  useEffect(() => {
    if (externalMergedData) {
      setMergedData(externalMergedData);
      return;
    }

    console.log("Processing reports:", allReports);
    console.log("Processing notes:", allNotes);
    console.log("Current patient:", patient);

    // Check if we have any data at all
    const hasData = allReports.length > 0 || allNotes.length > 0;

    if (hasData) {
      const processData = () => {
        // Filter notes by patient name first
        const filteredNotes = filterNotesByPatient(allNotes, patient);
        console.log("Filtered notes for current patient:", filteredNotes);

        // Combine filtered notes with reports
        const allData = [...allReports, ...filteredNotes];
        console.log("Combined data after filtering:", allData);

        // Separate notes and reports based on type
        const { notes, reports } = separateNotesAndReports(allData);
        console.log("Separated notes:", notes);
        console.log("Separated reports:", reports);

        // Group by date
        const groupedReports = groupByDate(reports);
        const groupedNotes = groupByDate(notes);

        console.log("Grouped reports:", groupedReports);
        console.log("Grouped notes:", groupedNotes);

        const allDates = Array.from(
          new Set([
            ...Object.keys(groupedReports),
            ...Object.keys(groupedNotes),
          ])
        );

        console.log("All dates:", allDates);

        const processedData = allDates
          .map((date) => ({
            date,
            reports: groupedReports[date] || [],
            notes: groupedNotes[date] || [],
            isExpanded: true,
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        console.log("Processed data:", processedData);
        return processedData;
      };

      setMergedData(processData());
    }
  }, [allReports, allNotes, externalMergedData, patientId, patient]);

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
            Medical Timeline
          </h3>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            No medical records found for this patient.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-medium text-gray-800">Medical Timeline</h3>
        {showDownloadCompleteButton && mergedData.length > 0 && (
          <button
            onClick={() => downloadCompletePDF(mergedData, patient)}
            className="flex items-center gap-1 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition w-full sm:w-auto justify-center"
          >
            <Download size={16} />
            <span>Download Complete Report</span>
          </button>
        )}
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="patient-report-header mb-6 border-b pb-4">
          <h2 className="text-lg md:text-xl font-bold text-primary mb-2">
            {patient.first_name} {patient.last_name} - Medical Report
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3">
            <InfoRow label="Card ID" value={patient.card_id} />
            <InfoRow label="Age" value={patient.age?.toString()} />
            <InfoRow label="Gender" value={patient.gender} />
            <InfoRow label="Phone" value={patient.phone_number} />
          </div>
        </div>

        <div className="space-y-3">
          {mergedData?.map((day, index) => (
            <div
              key={day.date}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <div className="p-3 md:p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <button
                  className="flex items-center gap-2 w-full sm:w-auto hover:bg-gray-100 px-2 py-1 rounded-md"
                  onClick={() => toggleDateExpansion(index)}
                >
                  <Calendar className="text-gray-600 w-4 h-4 md:w-5 md:h-5" />
                  <h3 className="font-medium text-gray-700 text-sm md:text-base">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  {day.isExpanded ? (
                    <ChevronUp className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <ChevronDown className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
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
                      className="flex items-center gap-1 text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-700 whitespace-nowrap"
                      title="Download as PDF"
                    >
                      <Download size={12} className="hidden xs:inline" />
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
                      className="flex items-center gap-1 text-xs bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 whitespace-nowrap"
                      title="Download as Image"
                    >
                      <Printer size={12} className="hidden xs:inline" />
                      <span>IMG</span>
                    </button>
                  </div>
                </div>
              </div>

              {day.isExpanded && (
                <div className="p-2 space-y-3">
                  {[...day.reports, ...day.notes]
                    .sort((a, b) => {
                      // Handle different date formats for sorting
                      const dateA = new Date(a.attributes.created_at);
                      const dateB = new Date(b.attributes.created_at);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map((item, itemIdx) => {
                      // Correct way to determine if it's a report or note
                      // Notes have type: "Doctor Report"
                      // Reports have type: "Case Report"
                      const isReport =
                        item.type === "Case Report" ||
                        item.case_report_id !== undefined;
                      const isNote = item.type === "Doctor Report";

                      console.log(
                        "Item type:",
                        item.type,
                        "isReport:",
                        isReport,
                        "isNote:",
                        isNote,
                        item
                      );

                      return (
                        <div
                          key={
                            isReport ? item.case_report_id || item.id : item.id
                          }
                          className="relative pl-6 pb-3"
                        >
                          {itemIdx !==
                            [...day.reports, ...day.notes].length - 1 && (
                            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                          )}

                          <div className="absolute left-0 top-0 bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center">
                            <Clock className="text-white w-2.5 h-2.5" />
                          </div>

                          <div className="text-xs text-gray-500 mb-1">
                            {new Date(
                              item.attributes.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          {isReport ? (
                            <ReportItem report={item} patientId={patientId} />
                          ) : isNote ? (
                            <NoteItem note={item} />
                          ) : (
                            <div className="text-gray-500 italic">
                              Unknown item type: {item.type}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isPaymentModalOpen && (
        <PaymentModal
          patientId={patientId}
          paymentData={paymentData}
          firstName={patient?.first_name}
          lastName={patient?.last_name}
          cardId={patient.card_id}
        />
      )}
    </div>
  );
};

export default MedicalTimeline;
