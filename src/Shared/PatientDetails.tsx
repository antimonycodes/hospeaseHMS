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
  const [isLoading] = useState(false);
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
  console.log(id);

  const { selectedPatient, getPatientById } = usePatientStore();

  console.log(selectedPatient);

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
      const date = new Date(item.attributes?.created_at)
        .toISOString()
        .split("T")[0];
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
    }
  }, [id, getPatientById, getAllReport, getMedicalNote]);
  const toggleDateExpansion = (index: number) => {
    const updatedData = [...mergedData];
    updatedData[index].isExpanded = !updatedData[index].isExpanded;
    setMergedData(updatedData);
  };

  if (!selectedPatient) return <Loader />;

  const patient = selectedPatient.attributes;

  const patientData: any = {
    firstName: "Philip",
    lastName: "Ikiko",
    patientId: "001602",
    sex: "Male",
    dob: "28/04/1990",
    age: "32",
    religion: "Christian",
    email: "philip.ikiko@gmail.com",
    phone: "+2347098765435",
    address: "3, John Ajayi's Close, Agodi, Ibadan Oyo State",
    branch: "Agodi",

    nextOfKin: {
      firstName: "Philip",
      lastName: "Juliet",
      relationship: "Sister",
      phone: "+2348012345678",
      religion: "Christian",
      address: "3, John Ajayi's Close, Agodi, Ibadan Oyo State",
    },
    doctorsReport: [
      {
        name: "Heart",
        value: "ASD - Left to right shunting. Good surgical repair",
      },
      { name: "Red Blood Cell Count (RBC)", value: "4.78 10^6/uL (Normal)" },
      { name: "Mean Blood Cell Count (MBC)", value: "4.9 10^3/uL (Normal)" },
      { name: "Hemoglobin (Hb)", value: "12.6 g/dL (Normal)" },
      { name: "Hematocrit (Hct)", value: "42.0% (Normal)" },
      { name: "Platelet Count (Plt)", value: "257K (Normal)" },
    ],
    medicalLaboratory: [
      {
        name: "Tests: CBC, BMP, Lipid profile and Fasting blood sugar test results.",
        value: "",
      },
      { name: "Complete Blood Count (CBC):", value: "" },
      { name: "White Blood Cell Count (WBC)", value: "8.5 x 10^3/L (Normal)" },
      { name: "Red Blood Cell Count (RBC)", value: "4.5 x 10^12/L (Normal)" },
      { name: "Hemoglobin (Hb)", value: "14.6 g/dL (Normal)" },
      { name: "Hematocrit (Hct)", value: "42.0% (Normal)" },
      { name: "Platelet Count", value: "250 x 10^9/L (Normal)" },
      { name: "Basic Metabolic Panel (BMP):", value: "" },
      { name: "Glucose", value: "85 mg/dL (Normal)" },
      { name: "Potassium", value: "4.1 mmol/L (Normal)" },
      { name: "Calcium", value: "9.5 mg/dL (Normal)" },
      { name: "Bicarbonate", value: "24 mmol/L (Normal)" },
      { name: "Blood Urea Nitrogen (BUN)", value: "15 mg/dL (Normal)" },
      { name: "Creatinine", value: "1.0 mg/dL (Normal)" },
      { name: "Glucose", value: "85 mg/dL (Normal)" },
    ],
    lipidProfile: [
      { name: "Total Cholesterol", value: "180 mg/dL (Normal)" },
      { name: "High-Density Lipoprotein (HDL)", value: "50 mg/dL (Normal)" },
      { name: "Low-Density Lipoprotein (LDL)", value: "110 mg/dL (Normal)" },
      { name: "Triglycerides", value: "140 mg/dL (Normal)" },
    ],
    fastingBloodSugar: [
      { name: "Fasting Glucose", value: "90 mg/dL (Normal)" },
      {
        name: "Interpretation",
        value: "All test results are within normal limits.",
      },
    ],
    pharmacy: [
      { name: "Total Cholesterol", value: "205 mg/dL (Normal)" },
      { name: "High-Density Lipoprotein (HDL)", value: "45 mg/dL (Normal)" },
      { name: "Low-Density Lipoprotein (LDL)", value: "100 mg/dL (Normal)" },
      { name: "Triglycerides", value: "154 mg/dL (Normal)" },
    ],
  };

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
              {/* <Button
                variant="edit"
                rounded="lg"
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Edit Patient
              </Button>
              <Button
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
        patientData={patientData}
        // onSave={handleSavePatient}
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
