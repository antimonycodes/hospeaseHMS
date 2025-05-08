import React, { useRef } from "react";
import { FileText, Camera, Printer, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PaymentReceiptProps {
  onClose: () => void;
  receiptNumber: string;
  paymentDate: any;
  selectedPatient: any;

  selectedItems: any[];
  totalAmount: number;
  paymentMethod: string;
  paymentType: any;
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
  const receiptRef = useRef(null);

  const formatAmount = (amount: any) => {
    return parseFloat(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date: any) => {
    if (!date) return "";
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

    html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Receipt-${receiptNumber}.pdf`);
    });
  };

  const handleDownloadImage = () => {
    if (!receiptRef.current) return;

    html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Receipt-${receiptNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content");
    if (!printContent) {
      console.error("Receipt content not found");
      return;
    }

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm h-screen overscroll-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg  h-screen overscroll-y-auto flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-end space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-2 border border-blue-600 rounded"
            >
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleDownloadImage}
              className="flex items-center text-green-600 hover:text-green-800 px-3 py-2 border border-green-600 rounded"
            >
              <Camera className="h-4 w-4 mr-2" />
              Download Image
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-600 rounded"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>

          <div
            id="receipt-content"
            ref={receiptRef}
            className="bg-white p-8 border rounded-lg shadow-sm "
          >
            {/* Receipt Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                PAYMENT RECEIPT
              </h1>
            </div>

            {/* Receipt Info */}
            <div className="flex justify-between mb-6 text-sm">
              <div>
                <p className="font-medium text-gray-500">Receipt No:</p>
                <p className="font-bold">{receiptNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-500">Date:</p>
                <p>{formatDate(paymentDate)}</p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Name:</p>
                  <p className="font-medium">
                    {selectedPatient?.attributes?.first_name}{" "}
                    {selectedPatient?.attributes?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Card ID:</p>
                  <p className="font-medium">
                    {selectedPatient?.attributes?.card_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">
                Payment Details
              </h3>
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left">Item</th>
                    <th className="py-2 px-4 text-center">Qty</th>
                    <th className="py-2 px-4 text-right">Unit Price</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedItems?.map((item, index) => (
                    <tr key={index} className="text-gray-600">
                      <td className="py-3 px-4">{item.attributes.name}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">
                        ₦{formatAmount(item.attributes.amount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        ₦{formatAmount(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-200 font-medium">
                  <tr className="text-gray-800">
                    <td className="py-3 px-4 text-right">Total:</td>
                    <td className="py-3 px-4 text-right text-green-600 font-bold">
                      ₦{formatAmount(totalAmount)}
                    </td>
                  </tr>
                  {paymentType === "part" && (
                    <>
                      <tr className="text-gray-800">
                        <td className="py-1 px-4 text-right">Amount Paid:</td>
                        <td className="py-1 px-4 text-right">
                          ₦{formatAmount(partAmount)}
                        </td>
                      </tr>
                      <tr className="text-gray-800">
                        <td className="py-1 px-4 text-right">Balance:</td>
                        <td className="py-1 px-4 text-right">
                          ₦{formatAmount(totalAmount - (partAmount ?? 0))}
                        </td>
                      </tr>
                    </>
                  )}
                </tfoot>
              </table>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between mb-8">
              <div>
                <p className="text-sm text-gray-500">Payment Method:</p>
                <p className="font-medium capitalize">{paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Type:</p>
                <p className="font-medium capitalize">
                  {paymentType === "full" ? "Full Payment" : "Part Payment"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-gray-500 text-sm">
              <p>Thank you for your payment!</p>
              <p>For any queries, please contact our finance department.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
