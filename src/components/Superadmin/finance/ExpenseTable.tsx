import Table from "../../../Shared/Table";

interface Expense {
  id: string;
  item: string;
  amount: string;
  purchasedFrom: string;
  purchasedBy: string;
  paymentMethod: string;
}
interface Payment {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  date: string;
}

const paymentData: Payment[] = [
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
  },
];

const ExpenseTable = () => {
  // Expense columns
  const paymentColumns = [
    { key: "id" as keyof Payment, label: "Payment ID" },
    { key: "patient" as keyof Payment, label: "Patient" },
    { key: "amount" as keyof Payment, label: "Amount" },
    { key: "purpose" as keyof Payment, label: "Purpose" },
    { key: "paymentMethod" as keyof Payment, label: "Payment Method" },
    { key: "date" as keyof Payment, label: "Date" },
  ];
  return (
    <div>
      <Table
        columns={paymentColumns}
        data={paymentData}
        rowKey="id"
        pagination={true}
        rowsPerPage={10}
      />
    </div>
  );
};

export default ExpenseTable;
