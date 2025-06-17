import { FileText, User, CheckCircle } from "lucide-react";
import {
  FormattedReportNote,
  StructuredReportDisplay,
} from "../../../utils/noteUtils";
import { useRole } from "../../../hooks/useRole";
import Button from "../../../Shared/Button";
import { useCombinedStore } from "../../../store/super-admin/useCombinedStore";
import { useGlobalStore } from "../../../store/super-admin/useGlobal";
import { useEffect, useState } from "react";

export const ReportItem = ({
  report,
  patientId,
}: {
  report: any;
  patientId: string;
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const staff = report.attributes.staff_details;
  const department = report.attributes.department?.name || "Unknown Department";
  const role = report.attributes.role || "Unknown Role"; // Role of report creator
  const createdAt = report.attributes.created_at || "";
  const isPaid = report.attributes.is_paid || false;
  const userRole = useRole(); // Current user's role
  const { getAllRoles, roles } = useGlobalStore();

  const { openPaymentModal, isPaymentModalOpen } = useCombinedStore();

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  // Check if current user can process payments
  const canProcessPayment =
    userRole === "admin" || userRole === "front-desk-manager";

  // Check if this is the original report (not a department copy)
  // Original reports typically have staff_details and status "sent"
  const isOriginalReport =
    report.attributes.staff_details !== null ||
    report.attributes.status === "sent";

  // Check if there are valid pharmacy items
  const hasValidPharmacyItems = report.attributes.requested_pharmacy_items;

  // Check if there are valid laboratory items
  const hasValidLabItems = report.attributes.laboratory_service_items;

  // Helper function to prepare pharmacy payment data
  const preparePharmacyPaymentData = () => {
    const validPharmacyItems = report.attributes.requested_items.filter(
      (item: any) =>
        item.inventory !== null && item.pharmacy_stock_request_quantity !== null
    );

    const departmentId = roles["pharmacist"]?.id;

    return validPharmacyItems.map((item: any) => ({
      patient_id: parseInt(patientId),
      amount:
        parseFloat(item.inventory.service_item_price) *
        parseInt(item.pharmacy_stock_request_quantity),
      service_charge_id: null, // Always null for pharmacy items
      request_pharmacy_id:
        report.pharmacy_stock_request_id ||
        parseInt(item.pharmacy_stock_request_id),
      doctor_bill_id: null,
      quantity: parseInt(item.pharmacy_stock_request_quantity),
      item_name: item.inventory.item,
      item_id: item.inventory.id,
      unit_price: parseFloat(item.inventory.service_item_price),
      department_id: departmentId,
      case_report_id: report.case_report_id, // Add case_report_id here
    }));
  };

  // Helper function to prepare laboratory payment data
  const prepareLaboratoryPaymentData = () => {
    const validLabItems = report.attributes.laboratory_service_charges.filter(
      (item: any) => item.service_charges !== null
    );

    const departmentId = roles["laboratory"]?.id;

    return validLabItems.map((item: any) => ({
      patient_id: parseInt(patientId),
      amount: parseFloat(item.service_charges.amount), // Fixed: Access amount from service_charges
      service_charge_id: item.service_charges.id,
      request_pharmacy_id: null, // Always null for lab items
      doctor_bill_id: null,
      quantity: 1,
      item_name: item.service_charges.name,
      service_type: "laboratory",
      item_id: item.service_charges.id,
      department_id: departmentId,
      case_report_id: report.case_report_id, // Add case_report_id here
    }));
  };

  const handleProcessPayment = () => {
    let paymentData: any = [];

    if (hasValidPharmacyItems) {
      paymentData = [...paymentData, ...preparePharmacyPaymentData()];
    }

    if (hasValidLabItems) {
      paymentData = [...paymentData, ...prepareLaboratoryPaymentData()];
    }

    // Pass the payment data to the modal (case_report_id is now included in each item)
    openPaymentModal(paymentData);
  };

  // Component for showing payment status
  const PaymentStatusButton = () => {
    // Only show to authorized users and on original reports
    if (!canProcessPayment || !isOriginalReport) {
      return null;
    }

    if (isPaid) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-md">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Payment Processed</span>
        </div>
      );
    }

    return <Button onClick={handleProcessPayment}>Process</Button>;
  };

  return (
    <div className="p-4  rounded-lg border border-[#667085]  hover:shadow-md transition mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <StaffAvatar staff={staff} />
          <StaffInfo
            name={
              staff?.first_name || staff?.last_name
                ? `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim()
                : null
            }
            role={role}
          />
        </div>
        <div className="flex flex-col items-end">
          <StatusBadge status={report.attributes.status} />
          <span className="text-xs text-gray-500 mt-1">{createdAt}</span>
        </div>
      </div>

      {report.attributes.note && (
        <div className="text-sm text-gray-600 mb-2">
          {" "}
          <FormattedReportNote note={report.attributes.note} />
        </div>
      )}

      {/* Only display pharmacy items section if valid items exist */}
      {hasValidPharmacyItems && (
        <div className="p-3 bg-white rounded-lg border border-gray-200 mt-4">
          <div className=" flex items-center justify-between py-2">
            <h2 className="text-md font-semibold text-gray-800 mb-3">
              Requested Drugs
            </h2>
            <PaymentStatusButton />
          </div>

          <div className="space-y-2">
            {report.attributes.requested_items.map(
              (item: any, index: number) => {
                // Only render items that have both inventory and quantity
                if (
                  item.inventory !== null &&
                  item.pharmacy_stock_request_quantity !== null
                ) {
                  const totalPrice =
                    parseFloat(item.inventory.service_item_price) *
                    parseInt(item.pharmacy_stock_request_quantity);
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">
                          {item.inventory.item}
                        </span>
                        <span className="text-xs text-gray-500">
                          ₦{item.inventory.service_item_price} per unit
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 block text-sm">
                          Qty: {item.pharmacy_stock_request_quantity}
                        </span>
                        <span className="font-medium text-gray-700">
                          ₦{totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }
            )}
          </div>
        </div>
      )}

      {/* Only display laboratory items section if valid items exist */}
      {/* Laboratory Services Display - Fixed */}
      {hasValidLabItems && (
        <div className="p-3 bg-white rounded-lg border border-gray-200 mt-4">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-md font-semibold text-gray-800 mb-3">
              Laboratory Services
            </h2>
            {/* Only show button if there are no pharmacy items (to avoid duplicate buttons) */}
            {!hasValidPharmacyItems && <PaymentStatusButton />}
          </div>

          <div className="space-y-2">
            {report.attributes.laboratory_service_charges.map(
              (item: any, index: number) => {
                // Only render items that have service_charges
                if (item.service_charges !== null) {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">
                          {item.service_charges.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {item.service_charges.id}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-700">
                          ₦{parseFloat(item.service_charges.amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }
            )}
          </div>
        </div>
      )}

      {report.attributes.file && (
        <div className="mt-3">
          <FileAttachment url={report.attributes.file} />
        </div>
      )}
    </div>
  );
};

const StaffAvatar = ({ staff }: { staff: any }) => (
  <div className="bg-gray-200 p-2 rounded-full">
    {staff?.image ? (
      <img src={staff.image} alt="Staff" className="w-6 h-6 rounded-full" />
    ) : (
      <User className="text-gray-500 w-5 h-5" />
    )}
  </div>
);

const StaffInfo = ({ name, role }: { name: string | null; role: string }) => (
  <div>
    {name ? (
      <p className="font-medium text-sm">{name}</p>
    ) : (
      <p className="font-medium text-sm text-gray-500"></p>
    )}
    <p className="text-xs text-gray-500 capitalize">{role}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`text-xs px-2 py-1 rounded-full ${
      status === "completed" || status === "sent"
        ? "bg-green-100 text-green-700"
        : status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {status}
  </span>
);

const FileAttachment = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center text-blue-600 text-sm hover:underline"
  >
    <FileText className="w-4 h-4 mr-2" />
    View Attachment
  </a>
);
