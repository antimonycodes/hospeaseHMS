import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  UserCheck,
  Download,
  RefreshCw,
} from "lucide-react";

// Define types for your data structure
interface IncomeBreakdown {
  payment_type: string;
  count: number;
  total_amount: number;
}

interface IncomeData {
  count_monthly_income: number;
  income_breakdown: IncomeBreakdown[];
  sum_of_monthly_income: string;
}

interface InventoryData {
  total_inventory_items: number;
  total_quantity: number;
  total_inventory_value: string;
  non_expired_items_count: number;
  expired_items_count: number;
  most_stocked_item: string | null;
  most_expensive_item: string | null;
  average_item_price: string;
}

interface AppointmentsByGender {
  male: number;
  female: number;
  other: number;
}

interface ReportData {
  total_appointments: number;
  appointments_by_status: Record<string, number>;
  appointments_by_gender: AppointmentsByGender;
  appointments_by_time: Record<string, number>;
  appointments_by_date: Record<string, number>;
  Income: IncomeData;
  inventory: InventoryData;
}

const Reports = () => {
  const { monthlyStats, stats, isLoading } = useCombinedStore();
  const [dateRange, setDateRange] = useState({
    start_date: "2025-05-01",
    end_date: "2025-05-30",
  });

  useEffect(() => {
    monthlyStats(dateRange);
  }, [monthlyStats, dateRange]);

  const handleDateSubmit = (e: FormEvent) => {
    e.preventDefault();
    monthlyStats(dateRange);
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount =
      typeof amount === "string" ? parseFloat(amount) || 0 : amount || 0;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  // Extract the actual report data from the array structure
  const reportData = (
    Array.isArray(stats) && stats.length > 0 ? stats[0] : undefined
  ) as ReportData | undefined;

  // StatCard Component
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "blue",
    subtitle,
  }: {
    title: string;
    value: React.ReactNode;
    icon: React.ComponentType<any>;
    color?: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  // ChartCard Component
  const ChartCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-600">
              Loading reports...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Monthly Reports
              </h1>
              <p className="text-gray-600">
                Comprehensive overview of your hospital operations
              </p>
            </div>

            {/* Date Range Selector */}
            <form
              onSubmit={handleDateSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDateRange((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDateRange((prev) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Generate Report
              </button>
            </form>
          </div>
        </div>

        {reportData && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Appointments"
                value={reportData.total_appointments || 0}
                icon={Calendar}
                color="blue"
              />
              <StatCard
                title="Monthly Income"
                value={formatCurrency(
                  reportData.Income?.sum_of_monthly_income || 0
                )}
                icon={DollarSign}
                color="green"
                subtitle={`${
                  reportData.Income?.count_monthly_income || 0
                } transactions`}
              />
              <StatCard
                title="Inventory Items"
                value={reportData.inventory?.total_inventory_items || 0}
                icon={Package}
                color="purple"
                subtitle={`Total qty: ${
                  reportData.inventory?.total_quantity || 0
                }`}
              />
              <StatCard
                title="Inventory Value"
                value={formatCurrency(
                  reportData.inventory?.total_inventory_value || 0
                )}
                icon={TrendingUp}
                color="orange"
              />
            </div>

            {/* Appointments Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appointment Status */}
              {reportData.appointments_by_status &&
                Object.keys(reportData.appointments_by_status).length > 0 && (
                  <ChartCard title="Appointment Status">
                    <div className="space-y-3">
                      {Object.entries(reportData.appointments_by_status).map(
                        ([status, count]) => (
                          <div
                            key={status}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {status === "accepted" ? (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-600" />
                              )}
                              <span className="capitalize text-gray-700">
                                {status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{count}</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    status === "accepted"
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  }`}
                                  style={{
                                    width: `${
                                      ((count || 0) /
                                        (reportData.total_appointments || 1)) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </ChartCard>
                )}

              {/* Gender Distribution */}
              {reportData.appointments_by_gender && (
                <ChartCard title="Patient Gender Distribution">
                  <div className="space-y-3">
                    {Object.entries(reportData.appointments_by_gender).map(
                      ([gender, count]) => (
                        <div
                          key={gender}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="capitalize text-gray-700">
                              {gender}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{count}</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-blue-500"
                                style={{
                                  width: `${
                                    ((count || 0) /
                                      (reportData.total_appointments || 1)) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ChartCard>
              )}
            </div>

            {/* Income Breakdown */}
            {reportData.Income && (
              <ChartCard title="Income Breakdown">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">
                      Total Income
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(
                        reportData.Income.sum_of_monthly_income || 0
                      )}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">
                      Full Payments
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {reportData.Income.income_breakdown?.find(
                        (item) => item.payment_type === "Full"
                      )?.count || 0}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">
                      Pending Payments
                    </p>
                    <p className="text-xl font-bold text-yellow-700">
                      {reportData.Income.income_breakdown?.find(
                        (item) => item.payment_type === "Pending"
                      )?.count || 0}
                    </p>
                  </div>
                </div>

                {reportData.Income.income_breakdown &&
                  reportData.Income.income_breakdown.length > 0 && (
                    <div className="space-y-2">
                      {reportData.Income.income_breakdown.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium">
                            {item.payment_type} Payment
                          </span>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatCurrency(item.total_amount || 0)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.count || 0} transactions
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </ChartCard>
            )}

            {/* Inventory Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportData.inventory && (
                <ChartCard title="Inventory Overview">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-600">Active Items</p>
                      <p className="text-xl font-bold text-green-700">
                        {reportData.inventory.non_expired_items_count || 0}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Package className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-red-600">Expired Items</p>
                      <p className="text-xl font-bold text-red-700">
                        {reportData.inventory.expired_items_count || 0}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Most Stocked Item:
                      </span>
                      <span className="font-medium">
                        {reportData.inventory.most_stocked_item || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Most Expensive Item:
                      </span>
                      <span className="font-medium">
                        {reportData.inventory.most_expensive_item || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Average Item Price:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          reportData.inventory.average_item_price || 0
                        )}
                      </span>
                    </div>
                  </div>
                </ChartCard>
              )}

              {/* Appointments by Date */}
              {reportData.appointments_by_date &&
                Object.keys(reportData.appointments_by_date).length > 0 && (
                  <ChartCard title="Daily Appointments">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Object.entries(reportData.appointments_by_date)
                        .sort(
                          ([a], [b]) =>
                            new Date(a).getTime() - new Date(b).getTime()
                        )
                        .map(([date, count]) => {
                          const maxCount = Math.max(
                            ...Object.values(reportData.appointments_by_date)
                          );
                          return (
                            <div
                              key={date}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                            >
                              <span className="text-sm text-gray-700">
                                {new Date(date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  weekday: "short",
                                })}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{count}</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full bg-blue-500"
                                    style={{
                                      width: `${
                                        maxCount > 0
                                          ? ((count || 0) / maxCount) * 100
                                          : 0
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </ChartCard>
                )}
            </div>

            {/* Appointment Times */}
            {reportData.appointments_by_time &&
              Object.keys(reportData.appointments_by_time).length > 0 && (
                <ChartCard title="Popular Appointment Times">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(reportData.appointments_by_time)
                      .sort(([, a], [, b]) => (b || 0) - (a || 0))
                      .map(([time, count]) => (
                        <div
                          key={time}
                          className="text-center p-4 bg-blue-50 rounded-lg"
                        >
                          <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-600">{time}</p>
                          <p className="text-xl font-bold text-blue-700">
                            {count || 0}
                          </p>
                          <p className="text-xs text-gray-500">appointments</p>
                        </div>
                      ))}
                  </div>
                </ChartCard>
              )}

            {/* Export Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Export Options
                  </h3>
                  <p className="text-gray-600">
                    Download your reports for external use
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export PDF
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!reportData && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Report Data Available
            </h3>
            <p className="text-gray-600 mb-6">
              Select a date range and generate a report to see your statistics
            </p>
            <button
              onClick={() => monthlyStats(dateRange)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
