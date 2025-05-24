import { useState, useEffect } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import { Loader2, X, CheckCircle } from "lucide-react";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";

interface TransferSuccessData {
  patientName: string;
  doctorName: string;
}

interface TransferToDocProps {
  onClose: () => void;
  patient: any; // Pass the patient directly from NurseDetail
  endpoint?: string;
  refreshEndpoint?: string;
  onTransferSuccess?: (successData: TransferSuccessData) => void;
}

const TransferToDoc = ({
  onClose,
  patient,
  onTransferSuccess,
}: TransferToDocProps) => {
  const { bookAppointment, isLoading } = usePatientStore();
  const { getAllStaffs, allStaffs, getAllRoles, roles } = useGlobalStore();

  const [appointmentData, setAppointmentData] = useState({
    patient_id: patient?.id || 0,
    user_id: null as number | null,
    department_id: null as number | null,
    date: "",
    time: "",
    appointmentType: "staff",
  });

  // Local success state for modal display
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferredDoctorName, setTransferredDoctorName] = useState("");

  const getFilteredDepartments = () => {
    if (!roles || typeof roles !== "object") return [];

    // Extract only doctor and nurse roles
    const doctorRole = roles.doctor;
    const nurseRole = roles.nurse;
    const laboratoryRole = roles.laboratory;

    // Return as array of filtered departments
    const filteredRoles = [];
    if (doctorRole) filteredRoles.push({ id: doctorRole.id, name: "Doctor" });
    if (nurseRole) filteredRoles.push({ id: nurseRole.id, name: "Nurse" });
    if (laboratoryRole)
      filteredRoles.push({ id: laboratoryRole.id, name: "laboratory" });

    return filteredRoles;
  };

  useEffect(() => {
    // Reset states when component mounts
    setTransferSuccess(false);
    setTransferredDoctorName("");

    // Fetch departments and staff members when component mounts
    getAllRoles();
    getAllStaffs();

    // Set the patient ID from the passed patient prop
    if (patient) {
      setAppointmentData((prev) => ({
        ...prev,
        patient_id: patient.id,
      }));
    }
  }, [getAllRoles, getAllStaffs, patient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "appointmentType") {
      // Reset staff/department selections when changing appointment type
      setAppointmentData((prev) => ({
        ...prev,
        appointmentType: value,
        user_id: null,
        department_id: null,
      }));
    } else if (name === "user_id") {
      setAppointmentData((prev) => ({
        ...prev,
        user_id: value ? Number(value) : null,
        department_id: null, // Clear department when selecting a staff
      }));
    } else if (name === "department_id") {
      setAppointmentData((prev) => ({
        ...prev,
        department_id: value ? Number(value) : null,
        user_id: null, // Clear user when selecting a department
      }));
    } else {
      setAppointmentData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const finalAppointmentData: any = {
      patient_id: appointmentData.patient_id,
      date: appointmentData.date,
      time: appointmentData.time,
    };

    if (appointmentData.appointmentType === "staff") {
      // Must send user_id (required for staff)
      finalAppointmentData.user_id = appointmentData.user_id;
    }

    if (appointmentData.appointmentType === "department") {
      // Send department_id if available, and always send user_id as null
      finalAppointmentData.department_id = appointmentData.department_id;
      finalAppointmentData.user_id = null;
    }

    console.log("Final Payload:", finalAppointmentData);

    try {
      const success = await bookAppointment(finalAppointmentData);
      if (success) {
        // Set local success state
        setTransferSuccess(true);

        // Determine doctor name and patient name
        let doctorName = "";
        if (
          appointmentData.appointmentType === "staff" &&
          appointmentData.user_id
        ) {
          const selectedStaff = allStaffs.find(
            (staff: any) => staff.id === appointmentData.user_id
          );
          if (selectedStaff) {
            doctorName = `Dr. ${selectedStaff.attributes.first_name} ${selectedStaff.attributes.last_name}`;
          }
        } else if (
          appointmentData.appointmentType === "department" &&
          appointmentData.department_id
        ) {
          const selectedDept = getFilteredDepartments().find(
            (dept) => dept.id === appointmentData.department_id
          );
          if (selectedDept) {
            doctorName = selectedDept.name;
          }
        }

        setTransferredDoctorName(doctorName || "Doctor");

        // Prepare success data for parent component
        const patientAttributes = patient?.attributes || {};
        const patientName = `${patientAttributes.first_name || ""} ${
          patientAttributes.last_name || ""
        }`.trim();

        const successData: TransferSuccessData = {
          patientName: patientName || "Patient",
          doctorName: doctorName || "Doctor",
        };

        // Auto-close modal after showing success for 2 seconds
        setTimeout(() => {
          if (onTransferSuccess) {
            onTransferSuccess(successData);
          } else {
            onClose();
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      // Handle error if needed
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const { patient_id, date, time, appointmentType } = appointmentData;

    // Basic validations
    if (!patient_id || !date || !time) {
      return false;
    }

    // Appointment type specific validations
    if (appointmentType === "staff" && !appointmentData.user_id) {
      return false;
    }

    if (appointmentType === "department" && !appointmentData.department_id) {
      return false;
    }

    return true;
  };

  const patientAttributes = patient?.attributes || {};

  const handleClose = () => {
    if (transferSuccess && onTransferSuccess) {
      // If transfer was successful, pass data to parent
      const patientName = `${patientAttributes.first_name || ""} ${
        patientAttributes.last_name || ""
      }`.trim();
      const successData: TransferSuccessData = {
        patientName: patientName || "Patient",
        doctorName: transferredDoctorName || "Doctor",
      };
      onTransferSuccess(successData);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-6">
      <div className="bg-white w-full max-w-3xl h-[90%] p-6 overflow-y-auto rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold">Transfer to Doctor</h2>
          <button
            onClick={handleClose}
            className="text-gray-700 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Message (shown in modal briefly) */}
        {transferSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div className="text-green-800">
              <p className="font-medium">
                {patientAttributes.first_name} {patientAttributes.last_name}{" "}
                transferred to {transferredDoctorName || "Doctor"} successfully!
              </p>
              <p className="text-sm text-green-600 mt-1">
                Closing modal automatically...
              </p>
            </div>
          </div>
        )}

        {/* Patient Info (pre-populated) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[
            {
              label: "First Name",
              value: patientAttributes.first_name,
            },
            {
              label: "Last Name",
              value: patientAttributes.last_name,
            },
            { label: "Card ID", value: patientAttributes.card_id },
          ].map((field, i) => (
            <div key={i}>
              <label className="text-sm text-gray-600">{field.label}</label>
              <input
                value={field.value || ""}
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-4 bg-gray-100"
              />
            </div>
          ))}
        </div>

        {/* Appointment Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-600">Choose Date</label>
              <input
                type="date"
                name="date"
                value={appointmentData.date}
                onChange={handleChange}
                disabled={transferSuccess}
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Choose Time</label>
              <input
                type="time"
                name="time"
                value={appointmentData.time}
                onChange={handleChange}
                disabled={transferSuccess}
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
              />
            </div>
          </div>

          {/* Appointment Type Selection */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">Appointment With</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="appointmentType"
                  value="staff"
                  checked={appointmentData.appointmentType === "staff"}
                  onChange={handleChange}
                  disabled={transferSuccess}
                  className="mr-2"
                />
                <span>Staff Member</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="appointmentType"
                  value="department"
                  checked={appointmentData.appointmentType === "department"}
                  onChange={handleChange}
                  disabled={transferSuccess}
                  className="mr-2"
                />
                <span>Department</span>
              </label>
            </div>
          </div>

          {/* Conditional rendering based on appointment type */}
          {appointmentData.appointmentType === "staff" ? (
            <div className="mb-6">
              <label className="text-sm text-gray-600">
                Select Staff Member
              </label>
              <select
                name="user_id"
                onChange={handleChange}
                disabled={transferSuccess}
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
                value={appointmentData.user_id || ""}
              >
                <option value="">Select Staff Member</option>
                {allStaffs.map((staff: any) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.attributes.first_name} {staff.attributes.last_name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-6">
              <label className="text-sm text-gray-600">Select Department</label>
              <select
                name="department_id"
                onChange={handleChange}
                disabled={transferSuccess}
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
                value={appointmentData.department_id || ""}
              >
                <option value="">Select Department</option>
                {getFilteredDepartments().map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Book Button */}
          <div className="mt-6">
            {!transferSuccess ? (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid()}
                className={`bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition flex items-center justify-center w-full
                  ${
                    isLoading || !isFormValid()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-6 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Transfer To Doctor"
                )}
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center w-full"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferToDoc;
