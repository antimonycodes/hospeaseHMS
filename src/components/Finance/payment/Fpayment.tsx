import { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
// import AddSourceModal from "../../../Shared/AddSourceModal";
import Tabs from "../../ReusablepatientD/Tabs";
import FpaymentTable from "./FpaymentTable";
import AddSourceModal from "./AddSourceModal";
import FsettingsTable from "./FsettingsTable";
// import FsettingsTable from "./FsettingsTable";

type FpaymentTableProps = {
  endpoint?: string;
  refreshEndpoint?: string;
  settingsEndpoint?: string;
};

const Fpayment = ({
  endpoint = "/save-patient-payment",
  refreshEndpoint = "/finance/patient-paymet-history",
  settingsEndpoint = "/finance/payment-sources",
}: FpaymentTableProps) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [mainTab, setMainTab] = useState(0); // 0 for Payment, 1 for Settings
  const [activeTab, setActiveTab] = useState<
    "All" | "part" | "full" | "pending"
  >("All");

  const {
    payments,
    pagination,
    getAllPayments,
    getPaymentSource,
    paymentSources,
    // sources,
    // getAllSources,
    isLoading,
  } = useFinanceStore();
  const baseEndpoint = "/medical-report/patient-payment-history";

  useEffect(() => {
    if (mainTab === 0) {
      console.log("Fetching payments with endpoint:", refreshEndpoint);
      getAllPayments("1", "10", baseEndpoint);
    } else {
      console.log("Fetching payment sources with endpoint:", settingsEndpoint);
      // getAllSources("1", "10", settingsEndpoint);
    }
  }, [getAllPayments, baseEndpoint, , settingsEndpoint, mainTab]);

  const getStatusCounts = () => {
    if (!Array.isArray(payments)) {
      return { All: 0, part: 0, full: 0, pending: 0 };
    }
    return payments.reduce(
      (acc, payment) => {
        const type = payment.attributes?.payment_type;
        if (type === "part") acc.part++;
        else if (type === "full") acc.full++;
        else if (type === "pending") acc.pending++;
        acc.All++;
        return acc;
      },
      { All: 0, part: 0, full: 0, pending: 0 }
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

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const openSourceModal = () => setIsSourceModalOpen(true);
  const closeSourceModal = () => setIsSourceModalOpen(false);

  const handleAddNew = () => {
    if (mainTab === 0) {
      openPaymentModal();
    } else {
      openSourceModal();
    }
  };

  return (
    <div className="w-full ">
      <div className="flex mb-6 bg-white rounded-lg p-4">
        <button
          className={`px-4 py-2 mr-4 font-medium ${
            mainTab === 0
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setMainTab(0)}
        >
          Payment
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            mainTab === 1
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setMainTab(1)}
        >
          Settings
        </button>
      </div>

      {mainTab === 0 ? (
        // Payment Tab Content
        <>
          <Tablehead
            tableTitle="Payments"
            showButton={true}
            typebutton="Add New"
            onButtonClick={handleAddNew}
          />

          {isPaymentModalOpen && (
            <AddPaymentModal
              onClose={closePaymentModal}
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

          <FpaymentTable
            pagination={pagination}
            payments={filteredPayments}
            isLoading={isLoading}
            baseEndpoint={baseEndpoint}
          />
        </>
      ) : (
        // Settings Tab Content
        <>
          <Tablehead
            tableTitle="Payment Sources"
            showButton={true}
            typebutton="Add New Source"
            onButtonClick={handleAddNew}
          />

          {isSourceModalOpen && <AddSourceModal onClose={closeSourceModal} />}

          <FsettingsTable />
        </>
      )}
    </div>
  );
};

export default Fpayment;
