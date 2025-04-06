import { useState, useEffect } from "react";
import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import AppointmentDetails from "../../Frontdesk/appointment/AppointmentDetails";
import BookAppointmentModal from "../../../Shared/BookAppointmentModal";

const FrondeskAppointmentTable = () => {
  const {
    appointments = [],
    getAllAppointments,
    isLoading,
  } = usePatientStore();

  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Accepted" | "Declined" | "Rescheduled"
  >("All");
  const [openModal, setOpenModal] = useState(false);

  const getStatusCounts = (): {
    All: number;
    Pending: number;
    Accepted: number;
    Declined: number;
    Rescheduled: number;
  } => {
    if (!appointments || appointments.length === 0) {
      return { All: 0, Pending: 0, Accepted: 0, Declined: 0, Rescheduled: 0 };
    }

    return appointments.reduce(
      (acc, appointment) => {
        const status =
          appointment.attributes?.status?.toLowerCase() || "pending";
        if (status === "pending") acc.Pending++;
        else if (status === "accepted") acc.Accepted++;
        else if (status === "declined" || status === "rejected")
          acc.Declined++; // Handle "rejected"
        else if (status === "rescheduled") acc.Rescheduled++;
        acc.All++;
        return acc;
      },
      { All: 0, Pending: 0, Accepted: 0, Declined: 0, Rescheduled: 0 }
    );
  };
  const statusCounts = getStatusCounts();

  useEffect(() => {
    getAllAppointments("/front-desk/appointment/all-records");
  }, [getAllAppointments]);

  const filteredAppointments =
    activeTab === "All"
      ? appointments
      : appointments.filter(
          (appointment) =>
            appointment.attributes?.status?.toLowerCase() ===
            activeTab.toLowerCase()
        );

  return (
    <div className="w-full h-full bg-white rounded-[8px] shadow overflow-hidden">
      <Tablehead
        tableTitle="Appointments"
        showButton={true}
        showSearchBar={true}
        typebutton="Book an Appointment"
        tableCount={filteredAppointments.length}
        showControls={true}
        onButtonClick={() => setOpenModal(true)}
      />

      <Tabs<"All" | "Pending" | "Accepted" | "Declined" | "Rescheduled">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["All", "Pending", "Accepted", "Declined", "Rescheduled"]}
      />

      <AppointmentDetails
        appointments={filteredAppointments}
        isLoading={isLoading}
      />

      {openModal && (
        <BookAppointmentModal
          onClose={() => setOpenModal(false)}
          endpoint="/front-desk/appointment/book"
        />
      )}
    </div>
  );
};

export default FrondeskAppointmentTable;
