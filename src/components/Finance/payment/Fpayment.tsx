import { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
import Tabs from "../../ReusablepatientD/Tabs";
import FpaymentTable from "./FpaymentTable";

const Fpayment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "All" | "Half Payment" | "Full Payment"
  >("All");
  const { payments = [], getAllPayments, isLoading } = useFinanceStore();

  useEffect(() => {
    getAllPayments("/finance/all-revenues");
  }, [getAllPayments]);

  const getStatusCounts = () => {
    if (!Array.isArray(payments) || payments.length === 0) {
      return { All: 0, "Half Payment": 0, "Full Payment": 0 };
    }

    return payments.reduce(
      (acc, payment) => {
        const status = payment.attributes?.is_active
          ? "Full Payment"
          : "Half Payment";
        if (status === "Half Payment") acc["Half Payment"]++;
        else if (status === "Full Payment") acc["Full Payment"]++;
        acc.All++;
        return acc;
      },
      { All: 0, "Half Payment": 0, "Full Payment": 0 }
    );
  };
  const statusCounts = getStatusCounts();

  const filteredPayments = Array.isArray(payments)
    ? activeTab === "All"
      ? payments
      : payments.filter(
          (payment) =>
            (payment.attributes?.is_active
              ? "Full Payment"
              : "Half Payment") === activeTab
        )
    : [];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Tablehead
        tableTitle="Payments"
        showButton={true}
        typebutton="Add New"
        onButtonClick={openModal}
      />
      {isModalOpen && (
        <AddPaymentModal
          showSearchBar={true}
          showPaymentType={true}
          onClose={closeModal}
          formData={{
            patient_id: "",
            amount: "",
            purpose: "",
            payment_method: "",
            payment_type: "",
          }}
        />
      )}

      <Tabs<"All" | "Full Payment" | "Half Payment">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["All", "Full Payment", "Half Payment"]}
      />
      <FpaymentTable payments={filteredPayments} isLoading={isLoading} />
    </div>
  );
};

export default Fpayment;
