import { useState, useEffect } from "react";
import { usePatientStore } from "../store/super-admin/usePatientStore";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import { Loader2, X } from "lucide-react";
import Select from "react-select";

interface Patient {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    card_id: string;
  };
}

interface PatientOption {
  value: number;
  label: string;
  patient: Patient;
}

interface BookAppointmentModalProps {
  onClose: () => void;
}

const BookAppointmentModal = ({ onClose }: BookAppointmentModalProps) => {
  const { bookAppointment, isLoading, getAllPatientsNoPerPage, patients } =
    usePatientStore();
  const { getAllStaffs, allStaffs, getAllRoles, roles } = useGlobalStore();

  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientOption, setSelectedPatientOption] =
    useState<PatientOption | null>(null);
  const [appointmentData, setAppointmentData] = useState({
    patient_id: 0,
    user_id: null as number | null,
    department_id: null as number | null,
    date: "",
    time: "",
    appointmentType: "staff",
  });

  const getFilteredDepartments = () => {
    if (!roles || typeof roles !== "object") return [];
    const doctorRole = roles.doctor;
    const nurseRole = roles.nurse;
    const laboratoryRole = roles.laboratory;
    const filteredRoles = [];
    if (doctorRole) filteredRoles.push({ id: doctorRole.id, name: "Doctor" });
    if (nurseRole) filteredRoles.push({ id: nurseRole.id, name: "Nurse" });
    if (laboratoryRole)
      filteredRoles.push({ id: laboratoryRole.id, name: "Laboratory" });
    return filteredRoles;
  };

  useEffect(() => {
    getAllRoles();
    getAllStaffs();
    getAllPatientsNoPerPage();
  }, [getAllRoles, getAllStaffs, getAllPatientsNoPerPage]);

  useEffect(() => {
    if (patients && patients.length > 0) {
      const options: PatientOption[] = patients.map((patient: Patient) => ({
        value: patient.id,
        label: `${patient.attributes.first_name} ${patient.attributes.last_name} — ${patient.attributes.card_id}`,
        patient,
      }));
      setPatientOptions(options);
      console.log("Updated patientOptions:", options);
    } else {
      setPatientOptions([]);
      console.log("No patients available, patientOptions set to empty");
    }
  }, [patients]);

  const handlePatientSelect = (selectedOption: PatientOption | null) => {
    if (selectedOption) {
      setSelectedPatient(selectedOption.patient);
      setSelectedPatientOption(selectedOption);
      setAppointmentData((prev) => ({
        ...prev,
        patient_id: selectedOption.value,
      }));
    } else {
      setSelectedPatient(null);
      setSelectedPatientOption(null);
      setAppointmentData((prev) => ({
        ...prev,
        patient_id: 0,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "appointmentType") {
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
        department_id: null,
      }));
    } else if (name === "department_id") {
      setAppointmentData((prev) => ({
        ...prev,
        department_id: value ? Number(value) : null,
        user_id: null,
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
      finalAppointmentData.user_id = appointmentData.user_id;
    }
    if (appointmentData.appointmentType === "department") {
      finalAppointmentData.department_id = appointmentData.department_id;
      finalAppointmentData.user_id = null;
    }
    const success = await bookAppointment(finalAppointmentData);
    if (success) {
      onClose();
      // window.location.reload();
    }
  };

  const isFormValid = () => {
    const { patient_id, date, time, appointmentType } = appointmentData;
    if (!patient_id || !date || !time) {
      return false;
    }
    if (appointmentType === "staff" && !appointmentData.user_id) {
      return false;
    }
    if (appointmentType === "department" && !appointmentData.department_id) {
      return false;
    }
    return true;
  };

  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "8px",
      minHeight: "56px",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
      },
    }),
    loadingIndicator: (provided: any) => ({
      ...provided,
      color: "#3b82f6",
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-6">
      <div className="bg-white w-full max-w-3xl h-[90%] p-6 overflow-y-auto rounded-xl shadow-lg">
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-2">
            Search Patient
          </label>
          {isLoading ? (
            <div>Loading patients...</div>
          ) : (
            <Select
              value={selectedPatientOption}
              onChange={handlePatientSelect}
              options={patientOptions}
              isClearable
              isSearchable
              placeholder="Select a patient..."
              noOptionsMessage={() => "No patients found"}
              styles={selectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          )}
        </div>

        {selectedPatient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              {
                label: "First Name",
                value: selectedPatient.attributes.first_name,
              },
              {
                label: "Last Name",
                value: selectedPatient.attributes.last_name,
              },
              { label: "Card ID", value: selectedPatient.attributes.card_id },
            ].map((field, i) => (
              <div key={i}>
                <label className="text-sm text-gray-600">{field.label}</label>
                <input
                  value={field.value}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-4 bg-gray-100"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-600">Choose Date</label>
              <input
                type="date"
                name="date"
                value={appointmentData.date}
                onChange={handleChange}
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
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
              />
            </div>
          </div>

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
                  className="mr-2"
                />
                <span>Department</span>
              </label>
            </div>
          </div>

          {appointmentData.appointmentType === "staff" ? (
            <div className="mb-6">
              <label className="text-sm text-gray-600">
                Select Staff Member
              </label>
              <select
                name="user_id"
                onChange={handleChange}
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

          <div className="mt-6">
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
                  Booking
                </>
              ) : (
                "Book Appointment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
