import { Payment, paymentData } from "../../../data/PaymentData";
import Table from "../../../Shared/Table";
import Tablehead from "../../ReusablepatientD/Tablehead";

const FinanceCard = () => {
  const columns: {
    key: keyof Payment;
    label: string;
    render: (value: string | number | boolean, row: Payment) => React.ReactNode;
  }[] = [
    {
      key: "id",
      label: "Patient ID",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "patient",
      label: "Patient Name",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },

    {
      key: "date",
      label: "Date",
      render: (value) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div>
      <Tablehead
        tableTitle="Recent Payments "
        showSearchBar={false}
        showControls={false}
      />
      <Table
        data={paymentData.slice(0, 3)}
        columns={columns}
        pagination={false}
        radius="rounded-lg"
        rowKey="id"
      />
    </div>
  );
};

export default FinanceCard;
