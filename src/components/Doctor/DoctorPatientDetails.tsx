import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  Loader,
  FileText,
  StickyNote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePatientStore } from "../../store/super-admin/usePatientStore";
import Button from "../../Shared/Button";
import EditPatientModal from "../../Shared/EditPatientModal";
import { useReportStore } from "../../store/super-admin/useReoprt";
import toast from "react-hot-toast";
import { useGlobalStore } from "../../store/super-admin/useGlobal";

const DoctorPatientDetails = () => {
  const [openSections, setOpenSections] = useState({
    doctorsReport: true,
    medicalLaboratory: true,
    pharmacy: false,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"note" | "report">("note");
  const [note, setNote] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const { selectedPatient, getPatientByIdDoc } = usePatientStore();
  const { createReport, createNote, getAllReport, allReports } =
    useReportStore();
  const { getAllRoles, roles } = useGlobalStore();

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  console.log(allReports, "alll");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleReportSubmit = async () => {
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    // Get the department ID from roles based on the selected department
    const departmentId = roles[selectedDepartment as keyof typeof roles]?.id;

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
        role: "pharmacist",
      });

      if (response) {
        toast.success("Report submitted successfully");
        // Reset fields after submission
        setReportNote("");
        setFile(null);
        setSelectedDepartment("");
      }
    } catch (error) {
      console.error("Report submission failed", error);
      toast.error("Failed to submit report");
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
        toast.success("Note added successfully");
        setNote("");
      }
    } catch (error) {
      console.error("Note submission failed", error);
      toast.error("Failed to add note");
    }
  };

  useEffect(() => {
    if (id) {
      getPatientByIdDoc(id);
      getAllReport(id);
    }
  }, [id, getPatientByIdDoc]);

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

      {/* EMR */}
      <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          EMR - Case Reports
        </h3>

        {/* {allReports?.map((report) => (
          <div
            key={report.case_report_id}
            className="border-b border-gray-300 py-4 mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100">
                  {report.attributes.staff_details.image ? (
                    <img
                      src={report.attributes.staff_details?.image}
                      alt="Staff"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{`${report.attributes.staff_details.first_name} ${report.attributes.staff_details.last_name}`}</p>
                  <p className="text-xs text-gray-500">
                    {report.attributes.role}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>{report.attributes.created_at}</p>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-sm font-medium">Note:</p>
              <p className="text-sm text-gray-600">{report.attributes.note}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {report.attributes.department.name}
              </p>
              <span
                className={`text-xs py-1 px-2 rounded-full ${
                  report.attributes.status === "completed"
                    ? "bg-green-100 text-green-500"
                    : "bg-yellow-100 text-yellow-500"
                }`}
              >
                {report.attributes.status}
              </span>
            </div>

            {report.attributes.file && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">File:</p>
                <a
                  href={report.attributes.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View/Download File
                </a>
              </div>
            )}
          </div>
        ))} */}
      </div>

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={patient}
        // onSave={handleSavePatient}
      />
    </div>
  );
};

export default DoctorPatientDetails;

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
