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
    date: "",
    time: "",
  });

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
    } else {
      setAppointmentData((prev) => ({
        ...prev,
        [name]: name === "user_id" ? Number(value) : value,
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
    const success = await bookAppointment(appointmentData, endpoint); // Pass custom endpoint
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
              { label: "Card ID", value: selectedPatient.id },
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
          <div className="grid grid-cols-1 gap-6">
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

            {/* <div>
              <label className="text-sm text-gray-600">Select Doctor</label>
              <select
                name="user_id"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-4"
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
          </div>

          {/* Book Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={!!isLoading}
              className={`bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition flex items-center justify-center
             ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
              {isLoading ? (
                <>
                  <Loader2 className=" size-6 mr-2 animate-spin" />
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
const generateTimeSlots = () => {
  const times = [];
  const start = 8 * 60; // 8:00 AM in minutes
  const end = 18 * 60; // 6:00 PM in minutes

  for (let minutes = start; minutes <= end; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const timeStr = `${hour.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
    times.push(timeStr);
  }

  return times;
};
