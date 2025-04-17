import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Printer,
  Download,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import EditPatientModal from "./EditPatientModal";
import Button from "./Button";
import { usePatientStore } from "../store/super-admin/usePatientStore";
import Loader from "./Loader";
import {
  downloadDateReportAsPDF,
  downloadDateReportAsImage,
  downloadCompletePDF,
} from "../utils/reportDownload";
import { useReportStore } from "../store/super-admin/useReoprt";
import { ReportItem } from "../components/Doctor/Patient-Details-Props/ReportItem";
import { NoteItem } from "../components/Doctor/Patient-Details-Props/NoteItem";
import toast from "react-hot-toast";

const PatientDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    doctorsReport: true,
    medicalLaboratory: true,
    pharmacy: false,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mergedData, setMergedData] = useState<
    Array<{
      date: string;
      reports: any[];
      notes: any[];
      isExpanded: boolean;
    }>
  >([]);
  const { id } = useParams<{ id: string }>();

  const { selectedPatient, getPatientById, updatePatient } = usePatientStore();

  const {
    createReport,
    createNote,
    getAllReport,
    allReports,
    getMedicalNote,
    allNotes,
  } = useReportStore();

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  useEffect(() => {
    if (allReports.length > 0 || allNotes.length > 0) {
      const processData = () => {
        const groupedReports = groupByDate(allReports);
        const groupedNotes = groupByDate(allNotes);

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
  }, [allReports, allNotes]);

  useEffect(() => {
    if (id) {
      getPatientById(id);
      getAllReport(id);
      getMedicalNote(id, "doctor");
      getMedicalNote(id, "consultant");
    }
  }, [id, getPatientById, getAllReport, getMedicalNote]);

  const toggleDateExpansion = (index: number) => {
    const updatedData = [...mergedData];
    updatedData[index].isExpanded = !updatedData[index].isExpanded;
    setMergedData(updatedData);
  };

  const handleSavePatient = async (updatedPatientData: any) => {
    if (!id) return;

    setIsLoading(true);
    try {
      await updatePatient(id, updatedPatientData);
      // toast.success("Patient information updated successfully");
      setIsEditModalOpen(false);
      getPatientById(id);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient information");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPatient) return <Loader />;

  const patient = selectedPatient.attributes;

  return (
    <div className="px-2 sm:px-0">
      <div className="bg-white rounded-lg custom-shadow mb-6">
        <div className="p-4 sm:p-6">
          {/*  */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            {/* Back button */}
            <Link
              to="/dashboard/patients"
              className="flex items-center text-gray-600 hover:text-primary"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Patients</span>
            </Link>
            {/*  */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="edit"
                rounded="lg"
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Edit Patient
              </Button>
              {/* <Button
                variant="delete"
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Delete Patient
              </Button> */}
            </div>
          </div>
          {/* Patient information card */}

          <div className="grid gap-6">
            {/* Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <InfoRow label="First Name" value={patient.first_name} />
              <InfoRow label="Last Name" value={patient.last_name} />
              <InfoRow label="Patient ID" value={patient.card_id} />
              <InfoRow label="Age" value={patient.age?.toString()} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Patient type" value={patient.patient_type} />
              <InfoRow
                label="CLinical Department"
                value={patient.clinical_department.name}
              />
              <InfoRow label="Branch" value={patient.branch} />
              <InfoRow label="Occupation" value={patient.occupation} />
              <InfoRow label="Religion" value={patient.religion} />
              <InfoRow label="Phone" value={patient.phone_number} />
              <InfoRow
                className="sm:col-span-2 md:col-span-3 lg:col-span-4"
                label="Address"
                value={patient.address}
              />
            </div>
            {/*  */}
            <hr className="text-[#979797]" />
            {/* Next of Kin */}
            <div className="">
              <div className="">
                <h3 className="text-sm font-medium text-gray-800 mb-4">
                  Next of Kin
                </h3>
                {patient.next_of_kin?.map((kin: any, index: any) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
                  >
                    <InfoRow label="First Name" value={kin.name} />
                    <InfoRow label="Last Name" value={kin.last_name} />
                    <InfoRow label="Gender" value={kin.gender} />
                    <InfoRow label="Occupation" value={kin.occupation} />
                    <InfoRow label="Phone" value={kin.phone} />
                    <InfoRow label="Relationship" value={kin.relationship} />
                    <InfoRow
                      className="sm:col-span-2 md:col-span-3 lg:col-span-4"
                      label="Address"
                      value={kin.address}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* emr */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Medical Timeline
          </h3>
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
        </div>

        <div className="timeline-container bg-white p-6 rounded-lg custom-shadow">
          <div className="patient-report-header mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-primary mb-1">
              {patient.first_name} {patient.last_name} - Medical Report
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              {/* <InfoRow label="Card ID" value={patient.} /> */}
              <InfoRow label="Card ID" value={patient.card_id} />
              <InfoRow label="Age" value={patient.age?.toString()} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Phone" value={patient.phone_number} />
            </div>
          </div>

          {mergedData.map((day, index) => (
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
                  </div>
                </div>
              </div>

              {day.isExpanded && (
                <div className="p-4 space-y-4">
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
                        return (
                          <div
                            key={isReport ? item.case_report_id : item.id}
                            className="timeline-item relative pl-8 pb-4 mb-4"
                          >
                            {/* Vertical line */}
                            {itemIdx !==
                              [...day.reports, ...day.notes].length - 1 && (
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
                              <ReportItem report={item} />
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

      <EditPatientModal
        isLoading={isLoading}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={selectedPatient?.attributes}
        onSave={handleSavePatient}
      />
    </div>
  );
};

export default PatientDetails;

// Reusable Component for Patient Info
const InfoRow = ({
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
