import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  // Loader,
  FileText,
  StickyNote,
  Download,
  Printer,
  Calendar,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePatientStore } from "../../store/super-admin/usePatientStore";
import Button from "../../Shared/Button";
import EditPatientModal from "../../Shared/EditPatientModal";
import { useReportStore } from "../../store/super-admin/useReoprt";
import toast from "react-hot-toast";
import { useGlobalStore } from "../../store/super-admin/useGlobal";
import {
  downloadDateReportAsPDF,
  downloadDateReportAsImage,
  downloadCompletePDF,
} from "../../utils/reportDownload";
import Loader from "../../Shared/Loader";

const DoctorPatientDetails = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("note");
  const [note, setNote] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [mergedData, setMergedData] = useState<
    Array<{
      date: string;
      reports: any[];
      notes: any[];
      isExpanded: boolean;
    }>
  >([]);

  const { id } = useParams();
  const { selectedPatient, getPatientByIdDoc } = usePatientStore();
  const {
    createReport,
    createNote,
    getAllReport,
    allReports,
    getMedicalNote,
    allNotes,
  } = useReportStore();
  const { getAllRoles, roles } = useGlobalStore();

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
    getAllRoles();
  }, [getAllRoles]);

  useEffect(() => {
    if (id) {
      getPatientByIdDoc(id);
      getAllReport(id);
      getMedicalNote(id, "doctor");
    }
  }, [id, getPatientByIdDoc, getAllReport, getMedicalNote]);

  const handleReportSubmit = async () => {
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    const departmentId = roles[selectedDepartment]?.id;
    if (!departmentId) {
      toast.error("Invalid department selected");
      return;
    }

    try {
      const response = await createReport({
        patient_id: id ?? "",
        note: reportNote,
        department_id: departmentId,
        parent_id: null,
        file,
        status: "pending",
        role: selectedDepartment,
      });

      if (response) {
        // toast.success("Report submitted successfully");
        setReportNote("");
        setFile(null);
        setSelectedDepartment("");
      }
    } catch (error) {
      // toast.error("Failed to submit report");
    }
  };

  const handleNoteSubmit = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const response = await createNote({
        note: note,
        patient_id: id ?? "",
      });

      if (response) {
        // toast.success("Note added successfully");
        setNote("");
      }
    } catch (error) {
      // toast.error("Failed to add note");
    }
  };

  const toggleDateExpansion = (index: number) => {
    const updatedData = [...mergedData];
    updatedData[index].isExpanded = !updatedData[index].isExpanded;
    setMergedData(updatedData);
  };

  const downloadAsPDF = () => {
    if (!selectedPatient?.attributes) return;

    const patient = selectedPatient.attributes;
    toast.loading("Preparing PDF for download...", { id: "pdf-download" });

    // Gather all report data into a simple format
    const reportData = mergedData.map((day) => {
      const items = [...day.reports, ...day.notes].sort(
        (a, b) =>
          new Date(b.attributes.created_at).getTime() -
          new Date(a.attributes.created_at).getTime()
      );

      const formattedItems = items.map((item) => {
        const isReport = "case_report_id" in item;
        const staff = item.attributes.staff_details;
        const time = new Date(item.attributes.created_at).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

        return {
          type: isReport ? "Report" : "Note",
          staffName: `${staff?.first_name || ""} ${staff?.last_name || ""}`,
          department: isReport
            ? item.attributes.department?.name || ""
            : "Doctor's Note",
          status: isReport ? item.attributes.status : null,
          note: item.attributes.note,
          time,
          file: isReport ? item.attributes.file : null,
        };
      });

      return {
        date: new Date(day.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        items: formattedItems,
      };
    });

    // Make an API call to your backend for PDF generation
    fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientName: `${patient.first_name} ${patient.last_name}`,
        patientId: patient.card_id,
        patientInfo: {
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone_number,
          address: patient.address,
        },
        reportData,
      }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${patient.first_name}-${patient.last_name}-Medical-Report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("PDF downloaded successfully", { id: "pdf-download" });
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF", { id: "pdf-download" });
        useFallbackPDFGeneration();
      });
  };

  // Fallback method using simple data export
  const useFallbackPDFGeneration = () => {
    if (!selectedPatient?.attributes) return;

    const patient = selectedPatient.attributes;

    // Create a simple text representation of the data
    let textContent = `MEDICAL REPORT\n\n`;
    textContent += `Patient: ${patient.first_name} ${patient.last_name}\n`;
    textContent += `Patient ID: ${patient.card_id}\n`;
    textContent += `Age: ${patient.age}\n`;
    textContent += `Gender: ${patient.gender}\n`;
    textContent += `Phone: ${patient.phone_number}\n\n`;
    textContent += `MEDICAL TIMELINE\n\n`;

    mergedData.forEach((day) => {
      textContent += `Date: ${new Date(day.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}\n\n`;

      const items = [...day.reports, ...day.notes].sort(
        (a, b) =>
          new Date(b.attributes.created_at).getTime() -
          new Date(a.attributes.created_at).getTime()
      );

      items.forEach((item) => {
        const isReport = "case_report_id" in item;
        const staff = item.attributes.staff_details;
        const time = new Date(item.attributes.created_at).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

        textContent += `Time: ${time}\n`;
        textContent += `Type: ${isReport ? "Report" : "Note"}\n`;
        textContent += `Staff: ${staff?.first_name || ""} ${
          staff?.last_name || ""
        }\n`;
        if (isReport) {
          textContent += `Department: ${
            item.attributes.department?.name || ""
          }\n`;
          textContent += `Status: ${item.attributes.status}\n`;
        } else {
          textContent += `Department: Doctor's Note\n`;
        }
        textContent += `Content: ${item.attributes.note}\n\n`;
      });

      textContent += `\n`;
    });

    // Create a blob and download it
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${patient.first_name}-${patient.last_name}-Medical-Report.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report downloaded as text file", { id: "pdf-download" });
  };

  const downloadAsCSV = () => {
    if (!selectedPatient?.attributes) return;

    const patient = selectedPatient.attributes;
    toast.loading("Generating CSV...", { id: "csv-download" });

    let csvContent = "Date,Time,Type,Staff,Department,Status,Content\n";

    mergedData.forEach((day) => {
      const items = [...day.reports, ...day.notes].sort(
        (a, b) =>
          new Date(b.attributes.created_at).getTime() -
          new Date(a.attributes.created_at).getTime()
      );

      items.forEach((item) => {
        const isReport = "case_report_id" in item;
        const staff = item.attributes.staff_details;
        const date = new Date(day.date).toLocaleDateString("en-US");
        const time = new Date(item.attributes.created_at).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        const type = isReport ? "Report" : "Note";
        const staffName = `${staff?.first_name || ""} ${
          staff?.last_name || ""
        }`;
        const department = isReport
          ? item.attributes.department?.name || ""
          : "Doctor's Note";
        const status = isReport ? item.attributes.status : "N/A";
        const content = item.attributes.note.replace(/"/g, '""'); // Escape quotes for CSV

        csvContent += `"${date}","${time}","${type}","${staffName}","${department}","${status}","${content}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${patient.first_name}-${patient.last_name}-Medical-Report.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV downloaded successfully", { id: "csv-download" });
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
              <ChevronLeft size={16} />
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
              {/*  */}
              <Button
                variant="delete"
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Delete Patient
              </Button>
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
                value={patient.clinical_department?.name}
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

      {/* Report & Note */}
      <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        {/* Tabs */}
        <div className="flex gap-6 mb-4 text-sm font-medium text-[#667185]">
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
              activeTab === "note"
                ? "text-primary bg-[#F0F4FF]"
                : "hover:text-primary"
            }`}
            onClick={() => setActiveTab("note")}
          >
            <StickyNote size={16} />
            Add Doctor's Note
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
              activeTab === "report"
                ? "text-primary bg-[#F0F4FF]"
                : "hover:text-primary"
            }`}
            onClick={() => setActiveTab("report")}
          >
            <FileText size={16} />
            Add Doctor's Report
          </button>
        </div>

        {/* Content */}
        {activeTab === "note" ? (
          <div className="space-y-4">
            <textarea
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter doctor's note..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleNoteSubmit}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Add Note
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              rows={5}
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              placeholder="Enter doctor's report..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a department</option>
              {roles && Object.keys(roles).length > 0 ? (
                <>
                  {roles["pharmacist"] && (
                    <option value="pharmacist">Pharmacy</option>
                  )}
                  {roles["laboratory"] && (
                    <option value="laboratory">Laboratory</option>
                  )}
                </>
              ) : (
                <>
                  <option value="loading" disabled>
                    Loading departments...
                  </option>
                </>
              )}
            </select>
            <button
              onClick={handleReportSubmit}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Add Report
            </button>
          </div>
        )}
      </div>

      {/* Merged EMR Timeline */}
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={patient}
      />
    </div>
  );
};

// Report Item Component
const ReportItem = ({ report }: { report: any }) => {
  const staff = report.attributes.staff_details;
  const department = report.attributes.department?.name || "Unknown Department";

  return (
    <div className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-full">
            {staff?.image ? (
              <img
                src={staff.image}
                alt="Staff"
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <User className="text-white w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">
              {staff?.first_name} {staff?.last_name}
            </p>
            <p className="text-xs text-gray-500">{department}</p>
          </div>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            report.attributes.status === "completed" || "sent"
              ? "bg-[#CCFFE7] text-[#009952]"
              : "bg-[#FFEBAA] text-[#B58A00]"
          }`}
        >
          {report.attributes.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-2">{report.attributes.note}</p>

      {report.attributes.file && (
        <a
          href={report.attributes.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 text-sm hover:underline"
        >
          <FileText className="w-4 h-4 mr-2" />
          View Attachment
        </a>
      )}
    </div>
  );
};

// Note Item Component
const NoteItem = ({ note }: { note: any }) => {
  const staff = note.attributes;
  console.log(staff, "kjhg");
  console.log(note);

  return (
    <div className="p-4 bg-white rounded-lg border-l-4 border border-blue-200 border-l-primary hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-blue-100 p-2 rounded-full">
          {staff?.image ? (
            <img
              src={staff.image}
              alt="Staff"
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="text-white w-5 h-5" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">{staff?.doctor_name}</p>
          <p className="text-xs text-gray-500">Doctor's Note</p>
        </div>
      </div>

      <p className="text-sm text-gray-600">{note.attributes.note}</p>
    </div>
  );
};

// Reusable InfoRow Component (Keep existing)
const InfoRow = ({ label, value, className = "" }: any) => (
  <div className={className}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);

export default DoctorPatientDetails;
