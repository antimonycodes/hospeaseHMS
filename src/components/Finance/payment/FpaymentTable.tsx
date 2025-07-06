import { useEffect, useState } from "react";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate } from "react-router-dom";
import PaymentTableFilter, { FilterValues } from "./PaymentTableFilters";
import ExportButton from "./ExportButton";

interface Department {
  id: number;
  name: string;
}

interface PaymentAttributes {
  from_doctor: string;
  patient: { id: number; first_name: string; last_name: string };
  amount: string;
  purpose: string;
  payment_method: string;
  payment_type?: string;
  is_active?: boolean;
  user_id: string;
  created_at: string;
  id: number;
  department: Department[];
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

// Enhanced Badge component for payment type with refund status support
const PaymentTypeBadge = ({
  paymentType,
}: {
  paymentType: string | undefined;
}) => {
  const type = paymentType?.toLowerCase() || "";

  const getBadgeStyle = () => {
    switch (type) {
      case "full":
        return {
          bg: "bg-[#CCFFE7]",
          text: "text-[#009952]",
          label: "Full Payment",
        };
      case "part":
      case "partial":
        return {
          bg: "bg-[#FEF3CD]",
          text: "text-[#B58A00]",
          label: "Part Payment",
        };
      case "pending":
        return {
          bg: "bg-[#FBE1E1]",
          text: "text-[#F83E41]",
          label: "Pending",
        };
      case "refund":
      case "refunded":
        return {
          bg: "bg-[#E1F5FE]",
          text: "text-[#0288D1]",
          label: "Refunded",
        };
      case "partially_refunded":
        return {
          bg: "bg-[#FFF3E0]",
          text: "text-[#EF6C00]",
          label: "Partially Refunded",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: type.charAt(0).toUpperCase() + type.slice(1),
        };
    }
  };

  const { bg, text, label } = getBadgeStyle();

  return (
    <span
      className={`px-2 py-1 ${bg} ${text} rounded-full text-xs font-medium`}
    >
      {label}
    </span>
  );
};

// Helper function to format department names
const formatDepartmentNames = (departments: Department[]): string => {
  if (!departments || departments.length === 0) {
    return "N/A";
  }
  return departments.map((dept) => dept.name).join(", ");
};

// Helper function to format payment type for export
const formatPaymentTypeForExport = (
  paymentType: string | undefined
): string => {
  const type = paymentType?.toLowerCase() || "";

  switch (type) {
    case "full":
      return "Full Payment";
    case "part":
    case "partial":
      return "Part Payment";
    case "pending":
      return "Pending";
    case "refund":
    case "refunded":
      return "Refunded";
    case "partially_refunded":
      return "Partially Refunded";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

// Helper function to format date for export
const formatDateForExport = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
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

  const [isFiltering, setIsFiltering] = useState(false);
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
            .flatMap((payment) => payment.attributes?.department || [])
            .map((dept) => dept.name)
            .filter((name): name is string => name !== undefined)
        )
      );

      // Extract unique payment methods
      const paymentMethods = Array.from(
        new Set(
          payments
            .map((payment) => payment.attributes?.payment_method)
            .filter((method): method is string => method !== undefined)
        )
      );

      // Extract unique payment types
      const paymentTypes = Array.from(
        new Set(
          payments
            .map((payment) => payment.attributes?.payment_type)
            .filter((type): type is string => type !== undefined)
        )
      );

      // Extract unique payment sources
      const paymentSources = Array.from(
        new Set(
          payments
            .map((payment) => payment.attributes?.payment_source)
            .filter((source): source is string => source !== undefined)
        )
      );

      setFilterOptions({
        departments,
        paymentMethods,
        paymentTypes,
        paymentSources,
      });
    }
  }, [payments]);

  // Handle row click - navigate to payment details
  const handleRowClick = (payment: PaymentAttributes) => {
    navigate(`/dashboard/finance/payment/${payment.id}`);
  };

  // Fetch payments with all active filters
  useEffect(() => {
    if (!baseEndpoint) return;

    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.toString());
    queryParams.append("per_page", perPage.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const endpoint = `${baseEndpoint}?${queryParams.toString()}`;
    getAllPayments(currentPage.toString(), perPage.toString(), endpoint);
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
    setCurrentPage(1);
    setFilters(newFilters);
    setIsFiltering(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      key: "from_doctor",
      label: "Doctor name",
      render: (_, row) => (
        <span className="text-[#667085] text-sm">{row.from_doctor || "-"}</span>
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
        <span className="text-primary text-sm font-medium">View Details</span>
      ),
    },
  ];

  // Define export columns (excluding the "View Details" column)
  const exportColumns = [
    {
      key: "patient",
      label: "Patient Name",
      formatter: (value: any) =>
        value ? `${value.first_name} ${value.last_name}` : "Unknown",
    },
    {
      key: "amount",
      label: "Total Amount",
      formatter: (value: any) => value || "N/A",
    },
    {
      key: "department",
      label: "Department",
      formatter: (value: Department[]) => formatDepartmentNames(value),
    },
    {
      key: "from_doctor",
      label: "Doctor Name",
      formatter: (value: any) => value || "-",
    },
    {
      key: "payment_method",
      label: "Payment Method",
      formatter: (value: any) => value || "N/A",
    },
    {
      key: "payment_type",
      label: "Payment Type",
      formatter: (value: any) => formatPaymentTypeForExport(value),
    },
    {
      key: "payment_source",
      label: "Source",
      formatter: (value: any) => value || "N/A",
    },
    {
      key: "created_at",
      label: "Date",
      formatter: (value: any) => formatDateForExport(value),
    },
    {
      key: "purpose",
      label: "Purpose",
      formatter: (value: any) => value || "N/A",
    },
  ];

  // Prepare additional info for export
  const getExportAdditionalInfo = () => {
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => {
        acc[key.replace("_", " ").toUpperCase()] = value;
        return acc;
      }, {} as Record<string, string>);

    return {
      totalRecords: pagination?.total || transformedPayments.length,
      dateRange:
        filters.from_date && filters.to_date
          ? `${filters.from_date} to ${filters.to_date}`
          : undefined,
      filters: activeFilters,
    };
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <PaymentTableFilter
            onFilterChange={handleFilterChange}
            departments={filterOptions.departments}
            paymentMethods={filterOptions.paymentMethods}
            paymentTypes={filterOptions.paymentTypes}
            paymentSources={filterOptions.paymentSources}
            isLoading={isLoading}
          />
        </div>

        {/* Export Button */}
        <div className="ml-4">
          <ExportButton
            data={transformedPayments}
            columns={exportColumns}
            filename="payments_report"
            title="Payments Report"
            additionalInfo={getExportAdditionalInfo()}
          />
        </div>
      </div>

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
          onPageChange={handlePageChange}
          clickableRows={true}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default FpaymentTable;
