import { useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate } from "react-router-dom";
import Tablehead from "../../ReusablepatientD/Tablehead";

interface Department {
  id: number;
  name: string;
}

interface PaymentAttributes {
  patient: { id: number; first_name: string; last_name: string };
  amount: string;
  purpose: string;
  payment_method: string;
  payment_type?: string;
  is_active?: boolean;
  user_id: string;
  created_at: string;
  id: number;
  department: Department[]; // Changed from single object to array
  payment_source?: string;
}

interface PaymentData {
  id: number;
  type: string;
  attributes: PaymentAttributes;
}

type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: any, row: T) => React.ReactNode;
};

type FpaymentTableProps = {
  isLoading?: boolean;
  payments: PaymentData[];
};

// Badge component for payment type
const PaymentTypeBadge = ({
  paymentType,
}: {
  paymentType: string | undefined;
}) => {
  const type = paymentType?.toLowerCase() || "";

  if (type === "full") {
    return (
      <span className="px-2 py-1 bg-[#CCFFE7] text-[#009952] rounded-full text-xs font-medium">
        Full Payment
      </span>
    );
  } else if (type === "part") {
    return (
      <span className="px-2 py-1 bg-[#FEF3CD] text-[#B58A00] rounded-full text-xs font-medium">
        Part Payment
      </span>
    );
  }

  return (
    <span className="text-gray-500 text-sm">
      {paymentType || "N/A"} Payment
    </span>
  );
};

const LabPaymnets = () => {
  const { getAllPayments, payments, isLoading, pagination } = useFinanceStore();
  const [transformedPayments, setTransformedPayment] = useState<
    PaymentAttributes[]
  >([]);
  const navigate = useNavigate();

  const handleViewMore = (payment: PaymentAttributes) => {
    console.log("View more clicked for:", payment);
    navigate(`/dashboard/finance/payment/${payment.id}`);
  };

  useEffect(() => {
    setTransformedPayment(
      payments.map((payment) => ({
        ...payment.attributes,
        id: payment.id,
      }))
    );
  }, [payments]);

  // Helper function to format department names
  const formatDepartmentNames = (departments: Department[]): string => {
    if (!departments || departments.length === 0) {
      return "N/A";
    }

    return departments.map((dept) => dept.name).join(", ");
  };

  // const baseEndpoint = "/medical-report/patient-payment-history";

  const [perPage, setPerPage] = useState(pagination?.per_page || 10);

  useEffect(() => {
    getAllPayments("1", "10");
  }, [getAllPayments]);

  const columns: Column<PaymentAttributes>[] = [
    {
      key: "patient",
      label: "Patient Name",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.patient
            ? `${row.patient.first_name} ${row.patient.last_name}`
            : "Unknown"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Total Amount",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.amount || "N/A"}</span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {formatDepartmentNames(row.department)}
        </span>
      ),
    },
    {
      key: "payment_method",
      label: "Payment Method",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.payment_method || "N/A"}
        </span>
      ),
    },
    {
      key: "payment_type",
      label: "Payment Type",
      render: (_, row) => <PaymentTypeBadge paymentType={row.payment_type} />,
    },
    {
      key: "created_at",
      label: "Date",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">
          {row.created_at || "N/A"}
        </span>
      ),
    },
    {
      key: "id",
      label: "",
      render: (_, row) => (
        <span
          className="text-primary text-sm font-medium cursor-pointer"
          onClick={() => handleViewMore(row)}
        >
          View More
        </span>
      ),
    },
  ];
  const handlePageChange = (page: number) => {
    // Call getAllPatients with the page number, perPage value, and the current baseEndpoint
    getAllPayments(
      page.toString(),
      perPage.toString(),
      "/medical-report/patient-payment-history"
    );
  };
  if (isLoading) {
    return <Loader />;
  }

  if (!transformedPayments.length) {
    return (
      <div className="mt-10 text-center text-gray-500">No payments found</div>
    );
  }

  return (
    <div>
      <Tablehead
        tableTitle="Payment History"
        // tableDescription="View all payments made by patients"
        showButton={false}
        // onButtonClick={openModal}
      />
      <Table
        data={transformedPayments}
        columns={columns}
        rowKey="id"
        pagination={true}
        paginationData={pagination}
        onPageChange={handlePageChange}
        loading={isLoading}
      />
    </div>
  );
};

export default LabPaymnets;
