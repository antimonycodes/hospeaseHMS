import { JSX, useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import Loader from "../../../Shared/Loader";

type ExpenseApiData = {
  item: string;
  purchased: string;
  amount: string;
  purchasedBy: string;
  paymentMethod: string;
  date: string;
  id: number;
};

const FexpensesTable = () => {
  const { expenses, getAllExpenses, isLoading, pagination } = useFinanceStore();
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

  const baseEndpoint = "/finance/all-expenses";

  useEffect(() => {
    getAllExpenses("1", "10", baseEndpoint);
  }, [getAllExpenses]);

  // Transform API data into the correct format
  const formattedExpenses: ExpenseApiData[] =
    expenses?.map((expense: any) => ({
      item: expense.attributes.item,
      paymentMethod: expense.attributes.payment_method,
      purchased: expense.attributes.from,
      amount: expense.attributes.amount,
      purchasedBy: expense.attributes.by,
      date: expense.attributes.created_at,
      id: expense.id,
    })) || [];

  const columns: {
    key: keyof ExpenseApiData;
    label: string;
    render: (_: any, expense: ExpenseApiData) => JSX.Element;
  }[] = [
    {
      key: "item",
      label: "Item",
      render: (_: any, expense: ExpenseApiData) => (
        <span className="text-dark font-medium text-sm">{expense.item}</span>
      ),
    },
    {
      key: "purchased",
      label: "Purchased From",
      render: (_: any, expense: ExpenseApiData) => (
        <span className="text-[#667085] text-sm">{expense.purchased}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (_: any, expense: ExpenseApiData) => (
        <span className="text-[#667085] text-sm">{expense.amount}</span>
      ),
    },
    {
      key: "purchasedBy",
      label: "Purchased By",
      render: (_: any, expense: ExpenseApiData) => (
        <span className="text-[#667085] text-sm">{expense.purchasedBy}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      render: (_: any, expense: ExpenseApiData) => (
        <span className="text-[#667085] text-sm">{expense.paymentMethod}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (_: any, expense: ExpenseApiData) => (
        <span className="text-[#667085] text-sm">{expense.date}</span>
      ),
    },
  ];
  const handlePageChange = (page: number) => {
    getAllExpenses(page.toString(), perPage.toString(), baseEndpoint);
  };
  if (isLoading) return <Loader />;

  return (
    <div className="w-full bg-white rounded-[10px] shadow-table  ">
      <Table
        data={formattedExpenses}
        columns={columns}
        rowKey="id"
        radius="rounded-none"
        pagination={true}
        paginationData={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FexpensesTable;
