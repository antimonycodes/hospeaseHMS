import { useState, useEffect } from "react";
import { usePatientStore } from "../store/super-admin/usePatientStore";
import { useDoctorStore } from "../store/super-admin/useDoctorStore";
import { Loader2, X } from "lucide-react";
import debounce from "lodash.debounce";
import { useLocation } from "react-router-dom";

interface BookAppointmentModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
}

const BookAppointmentModal = ({
  onClose,
  endpoint = "/admin/appointment/assign",
  refreshEndpoint = "/admin/appointment/all-records",
}: BookAppointmentModalProps) => {
  const { searchPatients, bookAppointment, isLoading } = usePatientStore();
  const { getAllDoctors, doctors, department, getAllDepartment } =
    useDoctorStore();
  // const location = useLocation();

  const [query, setQuery] = useState("");
  const [patientOptions, setPatientOptions] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState({
    patient_id: 0,
    user_id: 0,
    department_id: 0,
    date: "",
    time: "",
    appointmentType: "staff", // Default to staff appointment
  });

  // Mock departments data - replace with actual data fetch in your implementation
  const departments = [
    { id: 1, name: "General Medicine" },
    { id: 2, name: "Cardiology" },
    { id: 3, name: "Pediatrics" },
    { id: 4, name: "Nursing" },
    { id: 5, name: "Emergency Care" },
  ];

  // Mock staff data - it will include nurses along with doctors
  // In your implementation, you'll need to fetch staff from API
  const staffMembers = [
    ...doctors,
    // Add nurses or other staff here when implementing the actual logic
  ];

  useEffect(() => {
    getAllDepartment();
  }, [getAllDepartment]);

  // useEffect(() => {
  //   getAllDoctors();
  // }, [getAllDoctors]);
  // useEffect(() => {
  //   const doctorEndpoint = location.pathname.includes("/frontdesk")
  //     ? "/front-desk/doctors/all-records"
  //     : "/admin/doctors/all-records";

  //   getAllDoctors(doctorEndpoint);
  // }, [getAllDoctors, location.pathname]);

  const handleSearch = debounce(async (val: string) => {
    const results = await searchPatients(val);
    setPatientOptions(results || []);
  }, 300);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "query") {
      setQuery(value);
      handleSearch(value);
    } else if (name === "appointmentType") {
      // Reset staff/department selections when changing appointment type
      setAppointmentData((prev) => ({
        ...prev,
        appointmentType: value,
        user_id: 0,
        department_id: 0,
      }));
    } else {
      setAppointmentData((prev) => ({
        ...prev,
        [name]: ["user_id", "department_id"].includes(name)
          ? Number(value)
          : value,
      }));
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setAppointmentData((prev) => ({ ...prev, patient_id: patient.id }));
    setQuery(
      `${patient.attributes.first_name} ${patient.attributes.last_name}`
    );
    setPatientOptions([]); // Close dropdown
  };

  const handleSubmit = async () => {
    const success = await bookAppointment(appointmentData, endpoint);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-6">
      <div className="bg-white w-full max-w-3xl h-[90%] p-6 overflow-y-auto rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-700 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Patient Search */}
        <div className="mt-4 relative">
          <input
            type="search"
            name="query"
            value={query}
            onChange={handleChange}
            placeholder="Search patient by name or card ID..."
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
          />
          {patientOptions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow">
              {patientOptions.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {p.attributes.first_name} {p.attributes.last_name} —
                  {p.attributes.card_id}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Auto-filled Patient Info */}
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
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Choose Time</label>
              <input
                type="time"
                name="time"
                onChange={handleChange}
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

          {/* <div>
              <label className="text-sm text-gray-600">Select Doctor</label>
              <select
                name="user_id"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
                value={appointmentData.user_id || ""}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc: any) => (
                  <option key={doc.id} value={doc.attributes.user_id}>
                    Dr {doc.attributes.first_name} {doc.attributes.last_name}
                  </option>
                ))}
              </select>
            </div> */}
          <div>
            <label className="text-sm text-gray-600">Select Department</label>
            <select
              name="name"
              id=""
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-4"
            >
              <option value="">Select Department</option>
              {department.map((dept: any) => (
                <option key={dept.id} value={dept.attributes.department_id}>
                  {dept.attributes.department_name}
                  {/* {dept.attributes.name} */}
                </option>
              ))}
            </select>
          </div>

          {/* Book Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition flex items-center justify-center w-full
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
