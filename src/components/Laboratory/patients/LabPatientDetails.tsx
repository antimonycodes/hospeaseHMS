import { Link, useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import { Loader2 } from "lucide-react";

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
  const [status, setStatus] = useState("in Progress"); // Dropdown status default
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      getLabPatientById(patientId);
      getSingleReport(patientId);
    }
  }, [patientId, getLabPatientById, getSingleReport, caseId]);

  console.log(singleReport, selectedPatient);

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

  // Helper function to format date/time
  const formatDateTime = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isReportLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Back navigation */}
      <div className="flex items-center mb-4">
        <div className="flex items-center" onClick={() => navigate(-1)}>
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

      {/* Doctor's report */}
      <div>
        {singleReport.length > 0 &&
          singleReport
            .filter(
              (report) => report.attributes?.department?.name === "Laboratory"
            )
            .map((report) => (
              <div
                key={report.case_report_id}
                className="mb-6 bg-white custom-shadow p-6"
              >
                <h3 className="font-medium mb-4"> Report</h3>
                <p className="text-gray-700 mb-4">
                  {report.attributes.note || ""}
                </p>
                {report.attributes.file && (
                  <a
                    href={report.attributes.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center mb-4"
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
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    View Attachment
                  </a>
                )}
                <div className="flex items-center mt-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-gray-700">
                    {report.attributes.staff_details?.first_name?.[0] || "D"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {report.attributes.staff_details
                        ? ` ${report.attributes.staff_details.first_name} ${report.attributes.staff_details.last_name}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(report.attributes.created_at) || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pharmacy Report */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-6">
        <h3 className="font-medium mb-4 text-primary">Laboratory Report</h3>
        <textarea
          className="w-full border border-primary rounded-md p-3 h-24 mb-4"
          placeholder="Type the report..."
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
            <option value="In progress">in progress</option>
            <option value="Completed">completed</option>
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
              <Loader2 className=" size-6 mr-2 animate-spin" />
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
