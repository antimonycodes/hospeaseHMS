import { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
import Tabs from "../../ReusablepatientD/Tabs";
import FpaymentTable from "./FpaymentTable";

type FpaymentTableProps = {
  endpoint?: string;
  refreshEndpoint?: string;
};

const Fpayment = ({
  endpoint = "/save-patient-payment",
  refreshEndpoint = "/finance/patient-paymet-history",
}: FpaymentTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "All" | "part" | "full" | "pending"
  >("All");
  const { payments, pagination, getAllPayments, isLoading } = useFinanceStore();

  useEffect(() => {
    console.log("Fetching payments with endpoint:", refreshEndpoint);
    getAllPayments();
  }, [getAllPayments, refreshEndpoint]);

  const getStatusCounts = () => {
    if (!Array.isArray(payments)) {
      return { All: 0, part: 0, full: 0 };
    }

    return payments.reduce(
      (acc, payment) => {
        const type = payment.attributes?.payment_type;
        if (type === "part") acc.part++;
        else if (type === "full") acc.full++;
        acc.All++;
        return acc;
      },
      { All: 0, part: 0, full: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  const filteredPayments = Array.isArray(payments)
    ? activeTab === "All"
      ? payments
      : payments.filter(
          (payment) => payment.attributes?.payment_type === activeTab
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
          endpoint={endpoint}
          refreshEndpoint={refreshEndpoint}
        />
      )}

      <Tabs<"All" | "full" | "part" | "pending">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["All", "full", "part", "pending"]}
      />

      <FpaymentTable payments={filteredPayments} isLoading={isLoading} />
    </div>
  );
};

export default Fpayment;
