import { FileText, User } from "lucide-react";
import {
  FormattedReportNote,
  StructuredReportDisplay,
} from "../../../utils/noteUtils";

export const ReportItem = ({ report }: { report: any }) => {
  const staff = report.attributes.staff_details;
  const department = report.attributes.department?.name || "Unknown Department";
  const role = report.attributes.role || "Unknown Role";
  const createdAt = report.attributes.created_at || "";

  // Check if there are valid pharmacy items
  const hasValidPharmacyItems = report.attributes.requested_pharmacy_items;

  // Check if there are valid laboratory items
  const hasValidLabItems = report.attributes.laboratory_service_items;

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
        <p className="text-sm text-gray-600 mb-2">
          {" "}
          <FormattedReportNote note={report.attributes.note} />
        </p>
      )}

      {/* Only display pharmacy items section if valid items exist */}
      {hasValidPharmacyItems && (
        <div className="p-3 bg-white rounded-lg border border-gray-200 mt-4">
          <h2 className="text-md font-semibold text-gray-800 mb-3">
            Requested Drugs
          </h2>

          <div className="space-y-2">
            {report.attributes.requested_items.map(
              (item: any, index: number) => {
                // Only render items that have both inventory and quantity
                if (
                  item.inventory !== null &&
                  item.pharmacy_stock_request_quantity !== null
                ) {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md"
                    >
                      <span className="font-medium text-gray-700">
                        {item.inventory.item}
                      </span>
                      <span className="text-gray-500">
                        Qty: {item.pharmacy_stock_request_quantity}
                      </span>
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
      {hasValidLabItems && (
        <div className="p-3 bg-white rounded-lg border border-gray-200 mt-4">
          <h2 className="text-md font-semibold text-gray-800 mb-3">
            Laboratory Services
          </h2>

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
                      <span className="font-medium text-gray-700">
                        {item.service_charges.name}
                      </span>
                      {/* {item.service_charges.id && (
                        <span className="text-xs text-gray-500">
                          ID: {item.service_charges.id}
                        </span>
                      )} */}
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
