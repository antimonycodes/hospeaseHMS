import { useEffect, useState } from "react";
import Loader from "../../../Shared/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, FileText, Loader2, CheckCircle, X } from "lucide-react";
import { useNurseStore } from "../../../store/super-admin/useNuseStore";
import { useReportStore } from "../../../store/super-admin/useReoprt";
import MedicalTimeline from "../../../Shared/MedicalTimeline";
import Button from "../../../Shared/Button";
import TransferToDoc from "../Appointment/TransferToDoc";

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

interface TransferSuccessData {
  patientName: string;
  doctorName: string;
}

export interface VitalsData {
  weight: string;
  height: string;
  bmi: string;
  systolic: string;
  diastolic: string;
  temperature: string;
  respiratoryRate: string;
  heartRate: string;
  urineOutput: string;
  bloodSugarF: string;
  bloodSugarR: string;
  spo2: string;
  avpu: string;
  trauma: string;
  mobility: string;
  oxygenSupplementation: string;
  intake: string;
  output: string;
  vitalTakenTime: string;
  comments: string;
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

const NurseDetail = () => {
  const [reportNote, setReportNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { id } = useParams<{ id: string }>();
  const { selectedPatient, getPatientById, isLoading } = useNurseStore();
  const { deptCreateReport, isCreating, getAllReport } = useReportStore();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
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

  // Add transfer success state
  const [transferSuccess, setTransferSuccess] =
    useState<TransferSuccessData | null>(null);

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

  // Format vitals for report
  const formatVitalsForReport = () => {
    const vitalsEntries = Object.entries(vitals)
      .filter(([_, value]) => value.trim() !== "")
      .map(([key, value]) => {
        // Convert camelCase to readable labels
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .replace(/Bmi/, "BMI")
          .replace(/Spo2/, "SPO2")
          .replace(/Avpu/, "AVPU");

        return `${label}: ${value}`;
      });

    return vitalsEntries.length > 0
      ? `PATIENT VITALS:\n${vitalsEntries.join("\n")}\n\n`
      : "";
  };

  // Update report note whenever vitals change
  useEffect(() => {
    const vitalsReport = formatVitalsForReport();
    setReportNote(vitalsReport);
  }, [vitals]);

  console.log("Selected Patient in Component:", selectedPatient);

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedPatient || !selectedPatient.attributes) {
    return <div>No patient data found.</div>;
  }

  const patient: PatientAttributes = selectedPatient.attributes;
  const nextOfKinList: NextOfKin[] = patient.next_of_kin || [];

  // Handle vitals input change
  const handleVitalsChange = (field: keyof VitalsData, value: string) => {
    setVitals((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-calculate BMI if both weight and height are provided
    if (field === "weight" || field === "height") {
      const updatedVitals = { ...vitals, [field]: value };
      const weight = parseFloat(updatedVitals.weight);
      const height = parseFloat(updatedVitals.height);

      if (weight > 0 && height > 0) {
        const heightInMeters = height / 100; // Convert cm to meters
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setVitals((prev) => ({ ...prev, [field]: value, bmi }));
      }
    }
  };

  const handleReportSubmit = async () => {
    const response = await deptCreateReport({
      patient_id: id ?? null,
      note: reportNote,
      file: file,
      status: "completed",
      department_id: departmentId,
    });
    if (response) {
      setReportNote("");
      setFile(null);
      // Reset vitals
      setVitals({
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
      await getAllReport(id);
    }
    console.log("Report submitted successfully:", response);
  };

  // Handle transfer success from modal
  const handleTransferSuccess = (successData: TransferSuccessData) => {
    setTransferSuccess(successData);
    setOpenModal(false);
  };

  // Handle closing success message
  const handleCloseSuccessMessage = () => {
    setTransferSuccess(null);
  };

  return (
    <div>
      {/* Transfer Success Message */}
      {transferSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div className="text-green-800">
              <p className="font-medium">
                {transferSuccess.patientName} transferred to{" "}
                {transferSuccess.doctorName} successfully!
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseSuccessMessage}
            className="text-green-600 hover:text-green-800"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {/* Back button */}
        <div
          className="flex items-center text-gray-600 hover:text-primary mb-5"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} />
          <span className="ml-1">Patients</span>
        </div>
        <Button onClick={() => setOpenModal(true)}>Transfer To doctor</Button>

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

      {/* Enhanced Vitals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        <h3 className="col-span-full text-lg font-semibold mb-4">
          Patient Vitals
        </h3>

        {/* Basic Measurements */}
        <div className="flex flex-col gap-1">
          <label htmlFor="weight">Weight (KG)</label>
          <input
            type="number"
            id="weight"
            value={vitals.weight}
            onChange={(e) => handleVitalsChange("weight", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="70"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            value={vitals.height}
            onChange={(e) => handleVitalsChange("height", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="170"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bmi">BMI (kg/m²)</label>
          <input
            type="text"
            id="bmi"
            value={vitals.bmi}
            readOnly
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none bg-gray-50"
            placeholder="Auto-calculated"
          />
        </div>

        {/* Blood Pressure */}
        <div className="flex flex-col gap-1">
          <label htmlFor="systolic">Systolic B.P</label>
          <input
            type="number"
            id="systolic"
            value={vitals.systolic}
            onChange={(e) => handleVitalsChange("systolic", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="120"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="diastolic">Diastolic B.P</label>
          <input
            type="number"
            id="diastolic"
            value={vitals.diastolic}
            onChange={(e) => handleVitalsChange("diastolic", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="80"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="temperature">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            id="temperature"
            value={vitals.temperature}
            onChange={(e) => handleVitalsChange("temperature", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="36.5"
          />
        </div>

        {/* Vital Signs */}
        <div className="flex flex-col gap-1">
          <label htmlFor="respiratoryRate">Respiratory Rate (/Min)</label>
          <input
            type="number"
            id="respiratoryRate"
            value={vitals.respiratoryRate}
            onChange={(e) =>
              handleVitalsChange("respiratoryRate", e.target.value)
            }
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="20"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="heartRate">Heart Rate (BPM)</label>
          <input
            type="number"
            id="heartRate"
            value={vitals.heartRate}
            onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="72"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="urineOutput">Urine Output</label>
          <input
            type="text"
            id="urineOutput"
            value={vitals.urineOutput}
            onChange={(e) => handleVitalsChange("urineOutput", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="Normal"
          />
        </div>

        {/* Blood Sugar */}
        <div className="flex flex-col gap-1">
          <label htmlFor="bloodSugarF">Blood Sugar (F)</label>
          <input
            type="number"
            id="bloodSugarF"
            value={vitals.bloodSugarF}
            onChange={(e) => handleVitalsChange("bloodSugarF", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="80"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bloodSugarR">Blood Sugar (R)</label>
          <input
            type="number"
            id="bloodSugarR"
            value={vitals.bloodSugarR}
            onChange={(e) => handleVitalsChange("bloodSugarR", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="120"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="spo2">SPO2 (%)</label>
          <input
            type="number"
            id="spo2"
            value={vitals.spo2}
            onChange={(e) => handleVitalsChange("spo2", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="98"
          />
        </div>

        {/* Assessment Fields */}
        <div className="flex flex-col gap-1">
          <label htmlFor="avpu">AVPU</label>
          <select
            id="avpu"
            value={vitals.avpu}
            onChange={(e) => handleVitalsChange("avpu", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="Alert">Alert</option>
            <option value="Voice">Voice</option>
            <option value="Pain">Pain</option>
            <option value="Unresponsive">Unresponsive</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="trauma">Trauma</label>
          <select
            id="trauma"
            value={vitals.trauma}
            onChange={(e) => handleVitalsChange("trauma", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="mobility">Mobility</label>
          <select
            id="mobility"
            value={vitals.mobility}
            onChange={(e) => handleVitalsChange("mobility", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="Independent">Independent</option>
            <option value="Assisted">Assisted</option>
            <option value="Bed-bound">Bed-bound</option>
          </select>
        </div>

        {/* I/O and Support */}
        <div className="flex flex-col gap-1">
          <label htmlFor="oxygenSupplementation">Oxygen Supplementation</label>
          <select
            id="oxygenSupplementation"
            value={vitals.oxygenSupplementation}
            onChange={(e) =>
              handleVitalsChange("oxygenSupplementation", e.target.value)
            }
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Nasal Cannula">Nasal Cannula</option>
            <option value="Face Mask">Face Mask</option>
            <option value="Ventilator">Ventilator</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="intake">Intake (ml)</label>
          <input
            type="number"
            id="intake"
            value={vitals.intake}
            onChange={(e) => handleVitalsChange("intake", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="1500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="output">Output (ml)</label>
          <input
            type="number"
            id="output"
            value={vitals.output}
            onChange={(e) => handleVitalsChange("output", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="1200"
          />
        </div>

        <div className="col-span-full flex flex-col gap-1">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            rows={3}
            value={vitals.comments}
            onChange={(e) => handleVitalsChange("comments", e.target.value)}
            className="border border-[#D0D5DD] rounded-[6px] p-4 outline-none focus:ring-1 focus:ring-primary"
            placeholder="Additional observations or notes..."
          />
        </div>
      </div>

      {/* nurse report */}
      <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
        <button
          className={`flex mb-4 text-primary items-center gap-1 px-3 py-1 rounded-md transition
           `}
        >
          <FileText size={16} />
          Add Nurse's Report
        </button>

        <div className="space-y-4">
          <textarea
            disabled
            rows={8}
            value={reportNote}
            onChange={(e) => setReportNote(e.target.value)}
            placeholder="Vitals will appear here automatically as you fill them above."
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

      {openModal && (
        <TransferToDoc
          onClose={() => setOpenModal(false)}
          patient={selectedPatient}
          onTransferSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};

export default NurseDetail;
