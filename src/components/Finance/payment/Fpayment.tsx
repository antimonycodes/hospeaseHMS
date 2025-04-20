import { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
import Tabs from "../../ReusablepatientD/Tabs";
import FpaymentTable from "./FpaymentTable";

type FpaymentTableProps = {
  endpoint?: string; // For creating payments
  refreshEndpoint?: string; // For fetching payments
};

const Fpayment = ({
  endpoint = "/finance/save-revenue",
  refreshEndpoint = "/finance/all-revenues",
}: FpaymentTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "All" | "half payment" | "full payment"
  >("All");

  const { payments, pagination, getAllPayments, isLoading } = useFinanceStore();

  useEffect(() => {
    console.log("Fetching payments with endpoint:", refreshEndpoint);
    getAllPayments("1", "10", refreshEndpoint);
  }, [getAllPayments, refreshEndpoint]);

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

  console.log("Filtered payments:", filteredPayments);

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
          endpoint={endpoint} // For creating payments
          refreshEndpoint={refreshEndpoint} // For refreshing after creation
        />
      )}

      <Tabs<"All" | "full payment" | "half payment">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["All", "full payment", "half payment"]}
      />

      <FpaymentTable
        pagination={pagination}
        payments={filteredPayments}
        isLoading={isLoading}
        endpoint={refreshEndpoint}
      />
    </div>
  );
};

export default Fpayment;
