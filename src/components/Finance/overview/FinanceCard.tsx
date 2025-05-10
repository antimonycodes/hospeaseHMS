import { useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FpaymentTable from "../payment/FpaymentTable";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";

const FinanceCard = () => {
  const { payments, getAllPayments, isLoading, pagination } = useFinanceStore();

  useEffect(() => {
    getAllPayments("/finance/all-revenues");
  }, [getAllPayments]);

  console.log("Payments in FinanceCard:", payments);

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Recent Payments "
        showSearchBar={false}
        showControls={false}
      />

      <FpaymentTable payments={payments.slice(0, 5)} isLoading={isLoading} />
    </div>
  );
};

export default FinanceCard;
