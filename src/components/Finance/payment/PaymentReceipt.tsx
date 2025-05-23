import React, { useRef, useState } from "react";
import { FileText, Camera, Printer, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Patient {
  id: string;
  attributes: { first_name: string; last_name: string; card_id: string };
}

interface Item {
  id: string | number;
  attributes: {
    amount: number;
    name: string;
    isPharmacy: boolean;
    availableQuantity?: number;
  };
  quantity: number;
  total: number;
}

interface PaymentReceiptProps {
  onClose: () => void;
  receiptNumber: string;
  paymentDate: Date | null;
  selectedPatient: Patient | null;
  selectedItems: Item[];
  totalAmount: number;
  paymentMethod: string;
  paymentType: string;
  partAmount?: number;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  onClose,
  receiptNumber,
  paymentDate,
  selectedPatient,
  selectedItems,
  totalAmount,
  paymentMethod,
  paymentType,
  partAmount,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const hospitalName = localStorage.getItem("hospitalName") || "Your Hospital";
  const hospitalLogoPath = localStorage.getItem("hospitalLogo") || "";

  // Replace with your server's base URL where images are hosted
  const BASE_IMAGE_URL = "https://live.hospeasehms.com/storage/"; // TODO: Update with actual server URL
  const hospitalLogo = hospitalLogoPath
    ? hospitalLogoPath.startsWith("data:image")
      ? hospitalLogoPath // Already base64
      : `${BASE_IMAGE_URL}${hospitalLogoPath}` // Construct absolute URL
    : "";

  // Fallback image (base64 placeholder or local asset)
  const fallbackLogo =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHgQJ3pAAAAABJRU5ErkJggg=="; // 1x1 transparent pixel
  const [logoError, setLogoError] = useState(false);

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadPDF = () => {
    if (!receiptRef.current) return;

    html2canvas(receiptRef.current, { scale: 2, useCORS: true }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190; // Adjusted for A4 margins
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Receipt-${receiptNumber}.pdf`);
      }
    );
  };

  const handleDownloadImage = () => {
    if (!receiptRef.current) return;

    html2canvas(receiptRef.current, { scale: 2, useCORS: true }).then(
      (canvas) => {
        const link = document.createElement("a");
        link.download = `Receipt-${receiptNumber}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    );
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Failed to open print window");
      return;
    }

    const printContent = receiptRef.current.outerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt ${receiptNumber}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; margin: 20px; }
            .receipt-container { max-width: 800px; margin: 0 auto; }
            img { max-width: 100px; height: auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px 12px; text-align: left; }
            th { background-color: #f3f4f6; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .border-t { border-top: 2px solid #e5e7eb; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: 700; }
            .text-sm { font-size: 0.875rem; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-800 { color: #1f2937; }
            .text-green-600 { color: #16a34a; }
            .bg-gray-50 { background-color: #f9fafb; }
            .rounded-lg { border-radius: 8px; }
            .p-4 { padding: 16px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm h-screen overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close receipt"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-end space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-lg transition-colors"
              aria-label="Download receipt as PDF"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={handleDownloadImage}
              className="flex items-center text-green-600 hover:text-green-800 px-4 py-2 border border-green-600 rounded-lg transition-colors"
              aria-label="Download receipt as image"
            >
              <Camera className="h-4 w-4 mr-2" />
              Image
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-600 rounded-lg transition-colors"
              aria-label="Print receipt"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>

          <div
            id="receipt-content"
            ref={receiptRef}
            className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm max-w-[800px] mx-auto"
          >
            {/* Receipt Header */}
            <div className="text-center mb-8">
              {(hospitalLogo && !logoError) || hospitalLogoPath ? (
                <img
                  src={hospitalLogo || fallbackLogo}
                  alt={`${hospitalName} logo`}
                  className="mx-auto mb-4 h-16 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="mx-auto mb-4 h-16 flex items-center justify-center text-gray-500 text-sm">
                  No logo available
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-800">
                {hospitalName}
              </h1>
              <h2 className="text-xl font-semibold text-gray-600 mt-2">
                Payment Receipt
              </h2>
            </div>

            {/* Receipt Info */}
            <div className="flex justify-between mb-8 text-sm">
              <div>
                <p className="font-medium text-gray-500">Receipt No:</p>
                <p className="font-bold text-gray-800">{receiptNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-500">Date:</p>
                <p className="text-gray-800">{formatDate(paymentDate)}</p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name:</p>
                  <p className="font-medium text-gray-800">
                    {selectedPatient?.attributes?.first_name || "N/A"}{" "}
                    {selectedPatient?.attributes?.last_name || ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Card ID:</p>
                  <p className="font-medium text-gray-800">
                    {selectedPatient?.attributes?.card_id || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">
                Payment Details
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm">
                    <th className="py-3 px-4 text-left font-semibold">Item</th>
                    <th className="py-3 px-4 text-center font-semibold">Qty</th>
                    <th className="py-3 px-4 text-right font-semibold">
                      Unit Price
                    </th>
                    <th className="py-3 px-4 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedItems.length > 0 ? (
                    selectedItems.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-3 px-4 text-gray-600">
                          {item.attributes.name}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          ₦{formatAmount(item.attributes.amount)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          ₦{formatAmount(item.total)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-3 px-4 text-center text-gray-500"
                      >
                        No items selected
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 font-semibold">
                  <tr className="text-gray-800">
                    <td colSpan={3} className="py-4 px-4 text-right">
                      Total:
                    </td>
                    <td className="py-4 px-4 text-right text-green-600">
                      ₦{formatAmount(totalAmount)}
                    </td>
                  </tr>
                  {paymentType === "part" && partAmount !== undefined && (
                    <>
                      <tr className="text-gray-800">
                        <td colSpan={3} className="py-2 px-4 text-right">
                          Amount Paid:
                        </td>
                        <td className="py-2 px-4 text-right">
                          ₦{formatAmount(partAmount)}
                        </td>
                      </tr>
                      <tr className="text-gray-800">
                        <td colSpan={3} className="py-2 px-4 text-right">
                          Balance:
                        </td>
                        <td className="py-2 px-4 text-right">
                          ₦{formatAmount(totalAmount - partAmount)}
                        </td>
                      </tr>
                    </>
                  )}
                </tfoot>
              </table>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between mb-8 text-sm">
              <div>
                <p className="text-gray-500">Payment Method:</p>
                <p className="font-medium text-gray-800 capitalize">
                  {paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Type:</p>
                <p className="font-medium text-gray-800 capitalize">
                  {paymentType === "full" ? "Full Payment" : "Part Payment"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
              <p className="font-medium">Thank you for your payment!</p>
              <p className="mt-1">
                For inquiries, contact {hospitalName} Finance Department.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            aria-label="Close receipt modal"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
