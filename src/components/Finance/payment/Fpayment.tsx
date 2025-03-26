import { paymentData } from "../../../data/PaymentData";
import React, { useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Tabs from "../../ReusablepatientD/Tabs";
import FpaymentTable from "./FpaymentTable";

type PaymentStatus = "All" | "Full Payment" | "Half Payment";

const getPaymentCounts = () => {
  return paymentData.reduce(
    (acc: Record<PaymentStatus, number>, payment) => {
      if (payment.status in acc) {
        acc[payment.status as PaymentStatus]++;
      }
      acc["All"]++;
      return acc;
    },
    { All: 0, "Full Payment": 0, "Half Payment": 0 }
  );
};

const Fpayment = () => {
  const [activeTab, setActiveTab] = useState<PaymentStatus>("All");
  const statusCounts = getPaymentCounts();
  const filteredPayments =
    activeTab === "All"
      ? paymentData
      : paymentData.filter((p) => p.status === activeTab);
  return (
    <div>
      <Tablehead tableTitle="Payments" />
      <Tabs<"All" | "Full Payment" | "Half Payment">
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusCounts={statusCounts}
        tabs={["All", "Full Payment", "Half Payment"]}
      />
      <FpaymentTable payments={filteredPayments} />
    </div>
  );
};

export default Fpayment;
