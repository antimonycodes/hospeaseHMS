import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMatronNurse } from "../nurse/useMatronNurse";
import Loader from "../../../Shared/Loader";
import { ChevronLeft, FileText, Loader2 } from "lucide-react";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import { VitalsData } from "../../Nurse/patients/NurseDetail";

interface NextOfKin {
  name: string;
  last_name: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  relationship: string;
}

interface PatientAttributes {
  id?: number;
  first_name: string;
  last_name: string;
  card_id: string;
  phone_number: string | null;
  occupation: string;
  gender: string;
  address: string;
  age: number;
  branch: string | null;
  next_of_kin: NextOfKin[];
}

interface InfoRowItem {
  label: string;
  value: string | number | null;
}

const InfoRow: React.FC<{
  items: InfoRowItem[];
  columns?: string;
}> = ({ items, columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }) => (
  <div className={`grid gap-4 mb-4 ${columns}`}>
    {items.map(({ label, value }, i) => (
      <div key={i}>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value ?? "-"}</p>
      </div>
    ))}
  </div>
);

const MatronPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPatient, getPatientById, isLoading } = useMatronNurse();
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { deptCreateReport, isCreating } = useReportStore();
  const [departmentId, setDepartmentId] = useState<any>(null);

  useEffect(() => {
    const userInfoString = localStorage.getItem("user-info");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        const id = userInfo?.attributes?.department?.id ?? null;
        setDepartmentId(id);
      } catch (error) {
        console.error("Error parsing user-info from localStorage:", error);
      }
    }
  }, []);

  // Vitals state
  const [vitals, setVitals] = useState<VitalsData>({
    weight: "",
    height: "",
    bmi: "",
    systolic: "",
    diastolic: "",
    temperature: "",
    respiratoryRate: "",
    heartRate: "",
    urineOutput: "",
    bloodSugarF: "",
    bloodSugarR: "",
    spo2: "",
    avpu: "",
    trauma: "",
    mobility: "",
    oxygenSupplementation: "",
    intake: "",
    output: "",
    vitalTakenTime: "",
    comments: "",
  });

  useEffect(() => {
    if (id) {
      console.log("Fetching patient with ID:", id);
      getPatientById(parseInt(id)).catch((error) => {
        console.error("Error fetching patient:", error);
      });
    }
  }, [id, getPatientById]);

  console.log("Selected Patient in Component:", selectedPatient);

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedPatient || !selectedPatient.attributes) {
    return <div>No patient data found.</div>;
  }

  const patient: PatientAttributes = selectedPatient.attributes;
  const nextOfKinList: NextOfKin[] = patient.next_of_kin || [];

  const handleReportSubmit = async () => {
    const response = await deptCreateReport({
      patient_id: id ?? null,
      note: reportNote,
      file: file,
      status: "completed",
      department_id: departmentId,
      role: "matron",
    });
    if (response) {
      setReportNote("");
      setFile(null);
    }
    console.log("Report submitted successfully:", response);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {/* Back button */}
        <div
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-5"
        >
          <ChevronLeft size={16} />
          <span className="ml-1">Patients</span>
        </div>
        <div className="grid gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Patient Details</h2>
            <InfoRow
              items={[
                { label: "First Name", value: patient.first_name },
                { label: "Last Name", value: patient.last_name },
                { label: "Patient ID", value: patient.card_id },
                { label: "Age", value: patient.age },
              ]}
            />
            <InfoRow
              items={[
                { label: "Gender", value: patient.gender },
                { label: "Branch", value: patient.branch },
                { label: "Occupation", value: patient.occupation },
                { label: "Phone", value: patient.phone_number },
              ]}
            />
            <InfoRow
              columns="grid-cols-1"
              items={[{ label: "House Address", value: patient.address }]}
            />
          </div>

          <hr className="text-[#979797]" />
          <div>
            {" "}
            <h3 className="font-semibold mb-4">Next of Kin</h3>
            {nextOfKinList.length > 0 ? (
              nextOfKinList.map((kin, index) => (
                <div key={index} className="mb-6 p-4  ">
                  <InfoRow
                    items={[
                      { label: "First Name", value: kin.name },
                      { label: "Last Name", value: kin.last_name },
                      { label: "Gender", value: kin.gender },
                      { label: "Occupation", value: kin.occupation },
                    ]}
                  />
                  <InfoRow
                    items={[
                      { label: "Phone", value: kin.phone },
                      { label: "Relationship", value: kin.relationship },
                    ]}
                  />
                  <InfoRow
                    columns="grid-cols-1"
                    items={[{ label: "Address", value: kin.address }]}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No next of kin information available.
              </p>
            )}
          </div>
        </div>
      </div>
      {/*  */}
      <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        <button
          className={`flex mb-4 text-primary items-center gap-1 px-3 py-1 rounded-md transition
                   `}
          // onClick={() => setActiveTab("report")}
        >
          <FileText size={16} />
          Add Nurse's Report
        </button>

        {/* <p className="text-gray-500 text-sm mb-4">
                  Add a report for the patient. You can also upload a file if needed.
                </p> */}
        <div className="space-y-4">
          <textarea
            rows={5}
            value={reportNote}
            onChange={(e) => setReportNote(e.target.value)}
            placeholder="Enter nurse's report..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />

          <button
            onClick={handleReportSubmit}
            className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center
                    ${isCreating ? "opacity-50 cursor-not-allowed" : ""}
                    `}
            disabled={isCreating}
          >
            {isCreating ? (
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
      {id && (
        <MedicalTimeline
          patientId={id}
          patient={patient}
          showDownloadCompleteButton={false}
        />
      )}
    </div>
  );
};

export default MatronPatientDetails;
