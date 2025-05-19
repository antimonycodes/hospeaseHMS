import { useEffect, useState } from "react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import Tablehead from "../../ReusablepatientD/Tablehead";
import AddPaymentModal from "../../../Shared/AddPaymentModal";
import Tabs from "../../ReusablepatientD/Tabs";
import FpaymentTable from "./FpaymentTable";
import AddSourceModal from "./AddSourceModal";
import FsettingsTable from "./FsettingsTable";

type FpaymentTableProps = {
  endpoint?: string;
  refreshEndpoint?: string;
  settingsEndpoint?: string;
};

const Fpayment = ({
  endpoint = "/save-patient-payment",
  refreshEndpoint = "/finance/patient-paymet-history",
}: FpaymentTableProps) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [mainTab, setMainTab] = useState(0); // 0 for Payment, 1 for Settings
  const [activeTab, setActiveTab] = useState<
    "All" | "part" | "full" | "pending"
  >("All");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    payments,
    pagination,
    getAllPayments,
    getPaymentSource,
    paymentSources,
    isLoading,
  } = useFinanceStore();

  // Main endpoint for payment data
  const baseEndpoint = "/medical-report/patient-payment-history";

  // Initial data load
  useEffect(() => {
    if (isInitialLoad) {
      if (mainTab === 0) {
        // Build base query for the active tab filter
        let endpoint = baseEndpoint;
        if (activeTab !== "All") {
          endpoint = `${baseEndpoint}?payment_type=${activeTab.toLowerCase()}`;
        }

        getAllPayments("1", "50", endpoint);
      } else {
        getPaymentSource();
      }

      setIsInitialLoad(false);
    }
  }, [
    getAllPayments,
    getPaymentSource,
    baseEndpoint,
    mainTab,
    activeTab,
    isInitialLoad,
  ]);

  // Handle tab changes
  useEffect(() => {
    if (!isInitialLoad) {
      if (mainTab === 0) {
        // Build base query for the active tab filter
        let endpoint = baseEndpoint;
        if (activeTab !== "All") {
          endpoint = `${baseEndpoint}?payment_type=${activeTab.toLowerCase()}`;
        }

        getAllPayments("1", "50", endpoint);
      } else {
        getPaymentSource();
      }
    }
  }, [
    mainTab,
    activeTab,
    getAllPayments,
    getPaymentSource,
    baseEndpoint,
    isInitialLoad,
  ]);

  const getStatusCounts = () => {
    if (!Array.isArray(payments)) {
      return { All: 0, part: 0, full: 0, pending: 0 };
    }

    return payments.reduce(
      (acc, payment) => {
        const type = payment.attributes?.payment_type;
        if (type === "part") acc.part++;
        else if (type === "full") acc.full++;
        else acc.pending++;
        acc.All++;
        return acc;
      },
      { All: 0, part: 0, full: 0, pending: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  // Use the selected tab's payment list without additional filtering
  // The filtering is done at API level through the endpoint
  const filteredPayments = Array.isArray(payments) ? payments : [];

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

  const handleTabChange = (tab: "All" | "part" | "full" | "pending") => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
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
            setActiveTab={handleTabChange}
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
