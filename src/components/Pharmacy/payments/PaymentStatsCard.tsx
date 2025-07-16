import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDownIcon,
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";

interface PaymentStatsCardProps {
  payments: PaymentData[];
}

interface PaymentData {
  id: number;
  type: string;
  attributes: {
    patient: { id: number; first_name: string; last_name: string };
    amount: string;
    purpose?: string;
    payment_method: string;
    payment_type?: string;
    is_active?: boolean;
    user_id?: string;
    created_at: string;
    department: { id: number; name: string }[];
    payment_source?: string;
  };
}

interface DailyStats {
  date: string;
  totalAmount: number;
  pendingAmount: number;
  fullPaymentAmount: number;
  partPaymentAmount: number;
  totalTransactions: number;
  pendingTransactions: number;
  fullTransactions: number;
  partTransactions: number;
}

const PaymentStatsCard: React.FC<PaymentStatsCardProps> = ({ payments }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Process payments to get daily statistics
  const dailyStats = useMemo(() => {
    const statsMap = new Map<string, DailyStats>();

    payments.forEach((payment) => {
      const date = payment.attributes.created_at;
      const amount = parseFloat(payment.attributes.amount.replace(/,/g, ""));
      const paymentType = payment.attributes.payment_type?.toLowerCase();

      if (!statsMap.has(date)) {
        statsMap.set(date, {
          date,
          totalAmount: 0,
          pendingAmount: 0,
          fullPaymentAmount: 0,
          partPaymentAmount: 0,
          totalTransactions: 0,
          pendingTransactions: 0,
          fullTransactions: 0,
          partTransactions: 0,
        });
      }

      const stats = statsMap.get(date)!;
      stats.totalAmount += amount;
      stats.totalTransactions += 1;

      if (paymentType === "pending") {
        stats.pendingAmount += amount;
        stats.pendingTransactions += 1;
      } else if (paymentType === "full") {
        stats.fullPaymentAmount += amount;
        stats.fullTransactions += 1;
      } else if (paymentType === "part") {
        stats.partPaymentAmount += amount;
        stats.partTransactions += 1;
      }
    });

    return Array.from(statsMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [payments]);

  // Set default selected date to the most recent date
  useEffect(() => {
    if (dailyStats.length > 0 && !selectedDate) {
      setSelectedDate(dailyStats[0].date);
    }
  }, [dailyStats, selectedDate]);

  // Get current selected date stats
  const currentStats = useMemo(() => {
    return (
      dailyStats.find((stats) => stats.date === selectedDate) || {
        date: selectedDate,
        totalAmount: 0,
        pendingAmount: 0,
        fullPaymentAmount: 0,
        partPaymentAmount: 0,
        totalTransactions: 0,
        pendingTransactions: 0,
        fullTransactions: 0,
        partTransactions: 0,
      }
    );
  }, [dailyStats, selectedDate]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header with Date Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Statistics
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              {selectedDate ? formatDate(selectedDate) : "Select Date"}
            </span>
            <ChevronDownIcon
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {dailyStats.map((stats) => (
                <button
                  key={stats.date}
                  onClick={() => {
                    setSelectedDate(stats.date);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    selectedDate === stats.date
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {formatDate(stats.date)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Amount */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FaMoneyBill className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Amount</p>
              <p className="text-xl font-bold text-blue-800">
                {formatCurrency(currentStats.totalAmount)}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                {currentStats.totalTransactions} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Full Payment Amount */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">
                Full Payments
              </p>
              <p className="text-xl font-bold text-green-800">
                {formatCurrency(currentStats.fullPaymentAmount)}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {currentStats.fullTransactions} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Part Payment Amount */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <CreditCardIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">
                Part Payments
              </p>
              <p className="text-xl font-bold text-yellow-800">
                {formatCurrency(currentStats.partPaymentAmount)}
              </p>
              <p className="text-xs text-yellow-500 mt-1">
                {currentStats.partTransactions} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <ClockIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Pending Amount</p>
              <p className="text-xl font-bold text-red-800">
                {formatCurrency(currentStats.pendingAmount)}
              </p>
              <p className="text-xs text-red-500 mt-1">
                {currentStats.pendingTransactions} transactions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing statistics for {formatDate(selectedDate)}
          </span>
          <span className="text-gray-600">
            Total: {currentStats.totalTransactions} transactions
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatsCard;
