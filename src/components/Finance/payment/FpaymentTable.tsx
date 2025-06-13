import { useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate } from "react-router-dom";
import PaymentTableFilter, { FilterValues } from "./PaymentTableFilters";

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
  department: { name: string };
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
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null;
  baseEndpoint?: string;
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
  } else if (type === "pending") {
    return (
      <span className="px-2 py-1 bg-[#FBE1E1] text-[#F83E41] rounded-full text-xs font-medium">
        Pending
      </span>
    );
  } else {
    return (
      <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
        refunded
      </span>
    );
  }
};

const FpaymentTable = ({
  payments,
  isLoading,
  pagination,
  baseEndpoint,
}: FpaymentTableProps) => {
  const { getAllPayments } = useFinanceStore();
  const [transformedPayments, setTransformedPayment] = useState<
    PaymentAttributes[]
  >([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(pagination?.current_page || 1);
  const [perPage, setPerPage] = useState(pagination?.per_page || 10);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    department: "",
    payment_method: "",
    payment_type: "",
    payment_source: "",
    from_date: "",
    to_date: "",
  });

  // Add state to track if we're in the middle of a filter operation
  const [isFiltering, setIsFiltering] = useState(false);

  // Extract unique values for filters
  const [filterOptions, setFilterOptions] = useState({
    departments: [] as string[],
    paymentMethods: [] as string[],
    paymentTypes: [] as string[],
    paymentSources: [] as string[],
  });

  // Update the transformed payments when the raw payments change
  useEffect(() => {
    if (Array.isArray(payments)) {
      setTransformedPayment(
        payments.map((payment) => ({
          ...payment.attributes,
          id: payment.id,
        }))
      );

      // Extract unique departments
      const departments = Array.from(
        new Set(
          payments
            .map((payment) => payment.attributes?.department?.name)
            .filter(Boolean)
        )
      ) as string[];

      // Extract unique payment methods
      const paymentMethods = Array.from(
        new Set(
          payments
            .map((payment) => payment.attributes?.payment_method)
            .filter(Boolean)
        )
      ) as string[];

      // Extract unique payment types
      const paymentTypes = Array.from(
        new Set(
          payments
            .map((payment) => payment.attributes?.payment_type)
            .filter(Boolean)
        )
      ) as string[];

      // Extract unique payment sources
      const paymentSources = Array.from(
        new Set(
          payments
            .map((payment) => payment.attributes?.payment_source)
            .filter(Boolean)
        )
      ) as string[];

      setFilterOptions({
        departments,
        paymentMethods,
        paymentTypes,
        paymentSources,
      });
    }
  }, [payments]);

  const handleViewMore = (payment: PaymentAttributes) => {
    navigate(`/dashboard/finance/payment/${payment.id}`);
  };

  // Fetch payments with all active filters
  useEffect(() => {
    // Skip if there's no endpoint or if we're not actively filtering
    if (!baseEndpoint) {
      return;
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.toString());
    queryParams.append("per_page", perPage.toString());

    // Add filter values to query - only add non-empty values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    // Create the endpoint with query parameters
    const endpoint = `${baseEndpoint}?${queryParams.toString()}`;

    // Fetch data with current filters
    getAllPayments(currentPage.toString(), perPage.toString(), endpoint);

    // After fetching, reset the filtering flag
    setIsFiltering(false);
  }, [
    currentPage,
    perPage,
    filters,
    getAllPayments,
    baseEndpoint,
    isFiltering,
  ]);

  const handleFilterChange = (newFilters: FilterValues) => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    setFilters(newFilters);
    // Set the filtering flag to true to trigger data fetch
    setIsFiltering(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const handlePerPageChange = (newPerPage: number) => {
  //   setPerPage(newPerPage);
  //   setCurrentPage(1); // Reset to first page when items per page changes
  // };

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
          {row.department?.name || "N/A"}
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
      key: "payment_source",
      label: "Source",
      render: (_, row) => {
        return (
          <span className="text-[#667085] text-sm">
            {row.payment_source || "N/A"}
          </span>
        );
      },
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <PaymentTableFilter
        onFilterChange={handleFilterChange}
        departments={filterOptions.departments}
        paymentMethods={filterOptions.paymentMethods}
        paymentTypes={filterOptions.paymentTypes}
        paymentSources={filterOptions.paymentSources}
        isLoading={isLoading}
      />

      {!transformedPayments.length ? (
        <div className="mt-10 text-center text-gray-500">
          {isLoading ? "Loading payments..." : "No payments found"}
        </div>
      ) : (
        <Table
          data={transformedPayments}
          columns={columns}
          rowKey="id"
          pagination={true}
          paginationData={pagination}
          loading={isLoading}
          // onPageChange={handlePageChange}
          onPageChange={handlePageChange}
          // onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default FpaymentTable;
