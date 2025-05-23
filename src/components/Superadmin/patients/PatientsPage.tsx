import { useEffect, useState } from "react";
import InformationTable from "./InformationTable";
import AppointmentsTable from "./AppointmentsTable";
import Button from "../../../Shared/Button";
import { Plus, Search } from "lucide-react";
import AddPatientModal from "../../../Shared/AddPatientModal";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";
import SearchBar from "../../ReusablepatientD/SearchBar";

type PatientsPage = {
  endpoint?: string;
  bookEndpoint?: string;
  refreshEndpoint?: string;
};
const PatientsPage = ({
  endpoint = "/medical-report/appointment/all-records",
  bookEndpoint = "/medical-report/appointment/book",
  refreshEndpoint = "/admin/appointment/all-records",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"patient" | "appointment">(
    "patient"
  );
  const { appointments, pagination, isLoading, getAllAppointments } =
    usePatientStore();

  const [perPage, setPerPage] = useState(10);
  const handleOpenModal = () => {
    setModalType(activeTab === 0 ? "patient" : "appointment");
    setOpenModal(true);
  };
  const {
    getAllPatients,
    searchPatients,
    patients,
    createPatient,
    getPatientById,
    selectedPatient,
  } = usePatientStore();

  // useEffect(() => {
  //   getAllPatients();
  // }, [getAllPatients]);
  useEffect(() => {
    if (searchQuery) {
      searchPatients(searchQuery).then((fetchedPatients) => {
        usePatientStore.setState({ patients: fetchedPatients });
      });
    } else {
      getAllPatients();
    }
  }, [getAllPatients, searchPatients, searchQuery]);

  useEffect(() => {
    getAllAppointments("1", "10", endpoint);
  }, [getAllAppointments, endpoint]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <div className=" bg-white custom-shadow p-4">
      <div className=" flex flex-col xl:flex-row-reverse gap-4 xl:gap-24">
        {/* Search and Button */}

        <div className=" w-full flex-1 flex flex-col md:flex-row items-center gap-2">
          <div className="flex items-center space-x-4 min-w-[70%]  ">
            <SearchBar onSearch={handleSearch} />
          </div>
          {/* <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="Type to search"
              className="w-full border border-gray-200 py-2 pl-10 pr-4 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] size-4" />
          </div> */}

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
              size="sm"
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
          <AppointmentsTable
            data={{
              data: (appointments as unknown as { data: any[] }).data,
              pagination: pagination ?? {
                total: 0,
                per_page: 10,
                current_page: 1,
                last_page: 1,
                from: 0,
                to: 0,
              },
            }}
            isLoading={isLoading}
            endpoint={endpoint}
          />
        )}
      </div>

      {openModal && (
        <AddPatientModal
          onClose={() => setOpenModal(false)}
          createPatient={createPatient}
          isLoading={isLoading}
          endpoint="/admin/patient/create"
          // refreshendpoint="/admin/patient/fetch"
        />
      )}

      {openModal && modalType === "appointment" && (
        <BookAppointmentModal
          // endpoint={bookEndpoint}
          // refreshEndpoint={refreshEndpoint}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default PatientsPage;
