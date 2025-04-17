import { useEffect, useState } from "react";
import InformationTable from "./InformationTable";
import AppointmentsTable from "./AppointmentsTable";
import Button from "../../../Shared/Button";
import { Plus, Search } from "lucide-react";
import AddPatientModal from "../../../Shared/AddPatientModal";
// import BookAppointmentModal from "../../../Shared/BookAppointmentModal";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";
// import BookAppointmentModal from "../../../Shared/BookAppointmentModal";

const PatientsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"patient" | "appointment">(
    "patient"
  );

  const [perPage, setPerPage] = useState(10);
  const handleOpenModal = () => {
    setModalType(activeTab === 0 ? "patient" : "appointment");
    setOpenModal(true);
  };

  const {
    getAllPatients,
    patients,
    createPatient,
    getPatientById,
    selectedPatient,
    isLoading,
    pagination,
  } = usePatientStore();

  useEffect(() => {
    getAllPatients();
  }, []);

  return (
    <div className=" bg-white custom-shadow p-4">
      <div className=" flex flex-col xl:flex-row-reverse gap-4 xl:gap-24">
        {/* Search and Button */}
        <div className=" w-full flex-1 flex flex-col md:flex-row items-center gap-2">
          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="Type to search"
              className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
          </div>

          <div
            className={`w-full md:w-auto ${
              activeTab === 1 ? "hidden" : "block"
            }`}
          >
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4"
            >
              Add new Patient
              <Plus size={16} />
            </Button>
          </div>

          <div
            className={`w-full md:w-auto ${
              activeTab === 0 ? "hidden" : "block"
            }`}
          >
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4"
            >
              Book new appointment
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center text-xs gap-3">
          <h1
            className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
              activeTab === 0 ? "text-primary" : "text-[#667185]"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Patient Information
            <div
              className={`absolute left-0 -bottom-3 w-full h-[1px] ${
                activeTab === 0 ? "bg-primary" : "bg-[#E4E7EC]"
              }`}
            ></div>
          </h1>
          <h1
            className={`relative inline-block flex-none cursor-pointer text-sm md:text-base font-semibold ${
              activeTab === 1 ? "text-primary" : "text-[#667185]"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Patients Appointments
            <div
              className={`absolute left-0 -bottom-3 w-full h-[1px] ${
                activeTab === 1 ? "bg-primary" : "bg-[#E4E7EC]"
              }`}
            ></div>
          </h1>
        </div>
      </div>

      {/* Table */}
      <div className=" mt-4">
        {activeTab === 0 ? (
          <InformationTable
            patients={patients}
            pagination={pagination}
            isLoading={isLoading}
            // perPage={perPage}
          />
        ) : (
          <AppointmentsTable />
        )}
      </div>

      {openModal && (
        <AddPatientModal
          onClose={() => setOpenModal(false)}
          createPatient={createPatient}
          isLoading={isLoading}
          endpoint="/admin/patient/create"
          refreshendpoint="/admin/patient/fetch"
        />
      )}

      {openModal && modalType === "appointment" && (
        <BookAppointmentModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default PatientsPage;
