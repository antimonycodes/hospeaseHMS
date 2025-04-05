import { useState, useEffect } from "react";

import { usePatientStore } from "../../../store/super-admin/usePatientStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import AppointmentDetails from "../../Frontdesk/appointment/AppointmentDetails";
import FrontdeskAppointmentModal from "./FrontdeskAppointmentModal";

const FrondeskAppointmentTable = () => {
  const {
    appointments = [],
    getAllAppointments,
    isLoading,
  } = usePatientStore();
  console.log("Appointments fetched:", appointments);

  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Accepted" | "Declined" | "Rescheduled"
  >("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate the count for each status
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
          appointment.attributes?.status?.toLowerCase() || "pending"; // Normalize case

        if (status === "pending") acc.Pending++;
        else if (status === "accepted") acc.Accepted++;
        else if (status === "declined") acc.Declined++;
        else if (status === "rescheduled") acc.Rescheduled++;

        acc.All++; // Always increase the 'All' count
        return acc;
      },
      { All: 0, Pending: 0, Accepted: 0, Declined: 0, Rescheduled: 0 }
    );
  };
  const statusCounts = getStatusCounts();

  // Functions to handle modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllAppointments("/front-desk/appointment/all-records");
  }, [getAllAppointments]);

  // Filter appointments based on active tab
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
        onButtonClick={openModal}
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

      <FrontdeskAppointmentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default FrondeskAppointmentTable;
