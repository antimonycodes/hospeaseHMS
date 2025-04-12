import { useEffect } from "react";
import { Payment, paymentData } from "../../../data/PaymentData";
import Table from "../../../Shared/Table";
import Tablehead from "../../ReusablepatientD/Tablehead";
import FpaymentTable from "../payment/FpaymentTable";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";

const FinanceCard = () => {
  const { payments = [], getAllPayments, isLoading } = useFinanceStore();

  // const columns: {
  //   key: keyof Payment;
  //   label: string;
  //   render: (value: string | number | boolean, row: Payment) => React.ReactNode;
  // }[] = [
  //   {
  //     key: "id",
  //     label: "Patient ID",
  //     render: (value) => (
  //       <span className="text-dark font-medium text-sm">{value}</span>
  //     ),
  //   },
  //   {
  //     key: "patient",
  //     label: "Patient Name",
  //     render: (value) => (
  //       <span className="text-[#667085] text-sm">{value}</span>
  //     ),
  //   },
  //   {
  //     key: "amount",
  //     label: "Amount",
  //     render: (value) => (
  //       <span className="text-[#667085] text-sm">{value}</span>
  //     ),
  //   },
  //   {
  //     key: "purpose",
  //     label: "Purpose",
  //     render: (value) => (
  //       <span className="text-[#667085] text-sm">{value}</span>
  //     ),
  //   },
  //   {
  //     key: "paymentMethod",
  //     label: "Payment Method",
  //     render: (value) => (
  //       <span className="text-[#667085] text-sm">{value}</span>
  //     ),
  //   },

  //   {
  //     key: "date",
  //     label: "Date",
  //     render: (value) => (
  //       <span className="text-[#667085] text-sm">{value}</span>
  //     ),
  //   },
  // ];
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
      {/* <Table
        data={paymentData.slice(0, 3)}
        columns={columns}
        pagination={false}
        radius="rounded-lg"
        rowKey="id"
      /> */}
      <FpaymentTable payments={payments} isLoading={isLoading} />
    </div>
  );
};

export default FinanceCard;
