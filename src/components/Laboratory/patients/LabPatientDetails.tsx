import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import { Loader2 } from "lucide-react";
import LabMedicalTimeline from "./LabMedicalTimeline";
// import LabMedicalTimeline from "./LabMedicalTimeline";

const LabPatientDetails = () => {
  const { patientId, caseId } = useParams();
  const { getLabPatientById } = usePatientStore();
  const {
    isReportLoading,
    isResponding,
    getSingleReport,
    singleReport,
    respondToReport,
  } = useReportStore();
  const selectedPatient = usePatientStore((state) => state.selectedPatient);
  const isLoading = usePatientStore((state) => state.isLoading);
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState("In Progress"); // Dropdown status default
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      getLabPatientById(patientId);
      getSingleReport(patientId);
    }
  }, [patientId, getLabPatientById, getSingleReport, caseId]);

  const patient = selectedPatient?.attributes;

  // Handle report submit
  const handleReportSubmit = async () => {
    // Call the respondToReport function from the store
    if (!reportText) return;

    const formData = {
      note: reportText,
      status,
      file,
    };

    const success = await respondToReport(caseId, formData);
    if (success) {
      await getSingleReport(patientId);
      setReportText("");
      setStatus("In Progress");
      setFile(null);
    }
  };

  if (isReportLoading || isLoading) return <Loader />;

  return (
    <div className="p-4">
      {/* Back navigation */}
      <div className="flex items-center mb-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Patients</span>
        </div>
      </div>

      {/* Patient Basic Info Card */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["First Name", patient?.first_name],
            ["Last Name", patient?.last_name],
            ["Patient ID", patient?.card_id],
            ["Age", patient?.age],
            ["Gender", patient?.gender],
            ["Region", patient?.region],
            ["Occupation", patient?.occupation],
            ["Religion", patient?.religion],
            ["Phone", patient?.phone_number],
          ].map(([label, value], idx) => (
            <div key={idx}>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="font-medium">{value || ""}</p>
            </div>
          ))}
          <div className="col-span-3">
            <p className="text-gray-500 text-sm">House Address</p>
            <p className="font-medium">{patient?.address || ""}</p>
          </div>
        </div>
      </div>

      {/* Lab Medical Timeline */}
      {patient && patientId && (
        <LabMedicalTimeline
          patientId={patientId}
          patient={patient}
          showDownloadCompleteButton={true}
        />
      )}

      {/* Add Laboratory Report */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-6">
        <h3 className="font-medium mb-4 text-primary">Add Laboratory Report</h3>
        <textarea
          className="w-full border border-primary rounded-md p-3 h-24 mb-4"
          placeholder="Type the laboratory report..."
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        ></textarea>

        {/* Status Dropdown */}
        <div className="mb-4">
          <h4 className="text-gray-600 text-sm mb-2">Progress Status</h4>
          <select
            className="w-full appearance-none bg-white border border-gray-300 rounded-md p-2 pr-8"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* File input */}
        <div className="mb-4">
          <input
            type="file"
            className="w-full border border-gray-300 rounded-md p-2"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <button
          className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center     
                        ${
                          isResponding ? "opacity-50 cursor-not-allowed" : ""
                        }  `}
          onClick={handleReportSubmit}
          disabled={!!isResponding}
        >
          {isResponding ? (
            <>
              Adding
              <Loader2 className="size-6 ml-2 animate-spin" />
            </>
          ) : (
            "Add Report"
          )}
        </button>
      </div>
    </div>
  );
};

export default LabPatientDetails;
