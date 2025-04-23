import { useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FpaymentTable from "../payment/FpaymentTable";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";

const FinanceCard = () => {
  const { payments = [], getAllPayments, isLoading } = useFinanceStore();

  useEffect(() => {
    getAllPayments("/finance/all-revenues");
  }, [getAllPayments]);

  console.log("Payments in FinanceCard:", payments);
  if (isLoading) return <div>Loading payments...</div>;

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Recent Payments "
        showSearchBar={false}
        showControls={false}
      />

      <FpaymentTable
        payments={payments}
        isLoading={isLoading}
        // endpoint={""}
        // pagination={null}
      />
    </div>
  );
};

export default FinanceCard;
