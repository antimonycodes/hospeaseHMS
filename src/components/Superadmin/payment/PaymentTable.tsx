import Table from "../../../Shared/Table";

interface Payment {
  invoiceNumber: string;
  amount: string;
  date: string;
  paymentType: string;
  status: string;
}

const payments: Payment[] = [
  {
    invoiceNumber: "H08032025",
    amount: "₦1,000,000.00",
    date: "03/08/2025",
    paymentType: "Yearly Payment",
    status: "Pending",
  },
  {
    invoiceNumber: "H08032026",
    amount: "₦700,000.00",
    date: "03/08/2025",
    paymentType: "Quarterly",
    status: "Paid",
  },
  {
    invoiceNumber: "H08032027",
    amount: "₦500,000.00",
    date: "03/08/2025",
    paymentType: "Monthly",
    status: "Failed",
  },
];

const Column = [
  {
    key: "invoiceNumber" as keyof Payment,
    label: "Invoice Number",
    render: (value: string) => (
      <span className="text-sm text-custom-black font-medium">{value}</span>
    ),
  },
  {
    key: "amount" as keyof Payment,
    label: "Amount",
    render: (value: string) => (
      <span className="text-sm text-[#667085]">{value}</span>
    ),
  },
  {
    key: "date" as keyof Payment,
    label: "Date",
    render: (value: string) => (
      <span className="text-sm text-[#667085]">{value}</span>
    ),
  },
  {
    key: "paymentType" as keyof Payment,
    label: "Payment Type",
    render: (value: string) => (
      <span className="text-sm text-[#667085]">{value}</span>
    ),
  },
  {
    key: "status" as keyof Payment,
    label: "Status",
    render: (value: string) => (
      <span
        className={`py-1.5 px-2.5 rounded-full text-sm ${
          value === "Failed"
            ? "text-[#F83E41] bg-[#FCE9E9]"
            : value === "Pending"
            ? "bg-[#FEF3CD] text-[#B58A00]"
            : "text-[#009952] bg-[#CCFFE7]"
        }`}
      >
        {value}
      </span>
    ),
  },
];

const PaymentTable = () => {
  return (
    <div className=" bg-white">
      <Table
        columns={Column}
        data={payments}
        rowKey="invoiceNumber"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default PaymentTable;
