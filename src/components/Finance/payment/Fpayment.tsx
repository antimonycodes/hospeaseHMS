import { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
import Tabs from "../../ReusablepatientD/Tabs";
import FpaymentTable from "./FpaymentTable";

const Fpayment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "All" | "half payment" | "full payment"
  >("All");

  const { payments = [], getAllPayments, isLoading } = useFinanceStore();

  useEffect(() => {
    getAllPayments("/finance/all-revenues");
  }, [getAllPayments]);

  const getStatusCounts = () => {
    if (!Array.isArray(payments)) {
      return { All: 0, "half payment": 0, "full payment": 0 };
    }

    return payments.reduce(
      (acc, payment) => {
        const type = payment.attributes?.payment_type?.toLowerCase();

        if (type === "half payment") acc["half payment"]++;
        else if (type === "full payment") acc["full payment"]++;

        acc.All++;
        return acc;
      },
      { All: 0, "half payment": 0, "full payment": 0 }
    );
  };

  const statusCounts = getStatusCounts();

  const filteredPayments = Array.isArray(payments)
    ? activeTab === "All"
      ? payments
      : payments.filter(
          (payment) =>
            payment.attributes?.payment_type?.toLowerCase() ===
            activeTab.toLowerCase()
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
          onClose={closeModal}
          endpoint="/finance/save-revenue"
          refreshEndpoint="/finance/all-revenues"
        />
      )}

      <Tabs<"All" | "full payment" | "half payment">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["All", "full payment", "half payment"]}
      />

      <FpaymentTable payments={filteredPayments} isLoading={isLoading} />
    </div>
  );
};

export default Fpayment;
