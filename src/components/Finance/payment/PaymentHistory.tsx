import React from "react";
import {
  Calendar,
  CreditCard,
  User,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const PaymentHistory = ({ paymentHistory }: any) => {
  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    return numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getPaymentIcon = (paymentType: any) => {
    switch (paymentType) {
      case "full":
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case "part":
      case "partial":
        return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      case "refund":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPaymentTypeColor = (paymentType: any) => {
    switch (paymentType) {
      case "full":
        return "text-green-600 bg-green-50";
      case "part":
      case "partial":
        return "text-yellow-600 bg-yellow-50";
      case "refund":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentTypeLabel = (paymentType: string) => {
    switch (paymentType) {
      case "full":
        return "Full Payment";
      case "part":
      case "partial":
        return "Partial Payment";
      case "refund":
        return "Refund";
      default:
        return (
          paymentType?.charAt(0).toUpperCase() + paymentType?.slice(1) ||
          "Unknown"
        );
    }
  };

  if (!paymentHistory || paymentHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-600" />
          Payment History
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No payment history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 mt-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-gray-600" />
        Payment History
        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {paymentHistory.length} transaction
          {paymentHistory.length !== 1 ? "s" : ""}
        </span>
      </h3>

      <div className="space-y-4">
        {paymentHistory.map((payment: any) => {
          const amount = parseFloat(
            payment.attributes.amount.replace(/,/g, "")
          );
          const isZeroAmount = amount === 0;

          return (
            <div
              key={payment.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                isZeroAmount
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPaymentIcon(payment.attributes.payment_type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {getPaymentTypeLabel(payment.attributes.payment_type)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(
                          payment.attributes.payment_type
                        )}`}
                      >
                        {payment.attributes.payment_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {payment.attributes.created_at}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {payment.attributes.recorded_by?.first_name ||
                          "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-lg font-semibold ${
                      isZeroAmount
                        ? "text-gray-400"
                        : amount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isZeroAmount
                      ? "—"
                      : `₦${formatCurrency(payment.attributes.amount)}`}
                  </div>
                  {isZeroAmount && (
                    <div className="text-xs text-gray-400 mt-1">
                      Initial record
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Transactions:</span>
          <span className="font-medium">{paymentHistory.length}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-gray-600">Total Amount Paid:</span>
          <span className="font-medium text-green-600">
            ₦
            {formatCurrency(
              paymentHistory
                .reduce(
                  (sum: number, payment: { attributes: { amount: string } }) =>
                    sum +
                    parseFloat(payment.attributes.amount.replace(/,/g, "")),
                  0
                )
                .toString()
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
