import React, { useRef, useState } from "react";
import { FileText, Camera, Printer, X } from "lucide-react";

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
  amountPaid?: number;
  balance?: number;
  paymentMethod: string;
  paymentType: string;
  currentPaymentAmount?: number;
  refundAmount?: number;
  isNewPayment?: boolean;
  previousPayments?: any;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  onClose,
  receiptNumber,
  paymentDate,
  selectedPatient,
  selectedItems,
  totalAmount,
  amountPaid = 0,
  balance = 0,
  paymentMethod,
  paymentType,
  currentPaymentAmount = 0,
  refundAmount,
  isNewPayment = false,
  previousPayments,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [logoError, setLogoError] = useState(false);
  const hName = localStorage.getItem("hospitalName");

  const hospitalName = hName || "Hospital Name";

  // Determine if this is an update to an existing payment
  const isPaymentUpdate =
    amountPaid !== undefined && currentPaymentAmount !== undefined;

  // Updated getPaymentBreakdown function for PaymentReceipt component
  const getPaymentBreakdown = (): {
    previouslyPaid: number;
    thisPayment: number;
    totalPaid: number;
    remainingBalance: number;
  } => {
    if (!isNewPayment) {
      // For updates (from PaymentDetails), always show breakdown
      const totalPaidSoFar = amountPaid ?? 0;
      const thisPaymentAmount = currentPaymentAmount ?? 0;
      const previouslyPaidAmount = totalPaidSoFar - thisPaymentAmount;

      return {
        previouslyPaid: Math.max(0, previouslyPaidAmount),
        thisPayment: thisPaymentAmount,
        totalPaid: totalPaidSoFar,
        remainingBalance: Math.max(0, totalAmount - totalPaidSoFar),
      };
    } else {
      // For new payments (full, part, pending)
      if (paymentType === "full") {
        return {
          previouslyPaid: 0,
          thisPayment: totalAmount,
          totalPaid: totalAmount,
          remainingBalance: 0,
        };
      } else if (paymentType === "pending") {
        return {
          previouslyPaid: 0,
          thisPayment: 0,
          totalPaid: 0,
          remainingBalance: totalAmount,
        };
      } else if (paymentType === "part") {
        const thisPaymentAmount = currentPaymentAmount || 0;
        return {
          previouslyPaid: 0,
          thisPayment: thisPaymentAmount,
          totalPaid: thisPaymentAmount,
          remainingBalance: Math.max(0, totalAmount - thisPaymentAmount),
        };
      } else {
        // Default case (e.g., refund or unknown type)
        return {
          previouslyPaid: 0,
          thisPayment: 0,
          totalPaid: 0,
          remainingBalance: totalAmount,
        };
      }
    }
  };

  const { previouslyPaid, thisPayment, totalPaid, remainingBalance } =
    getPaymentBreakdown();

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

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: receiptRef.current.scrollWidth,
        height: receiptRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
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
    } catch (error) {
      console.error("PDF generation failed:", error);
      handlePrint();
    }
  };

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: receiptRef.current.scrollWidth,
        height: receiptRef.current.scrollHeight,
      });

      const link = document.createElement("a");
      link.download = `Receipt-${receiptNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Image generation failed:", error);
    }
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Failed to open print window");
      return;
    }

    const printContent = receiptRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt ${receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; }
            .receipt-container { max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #ddd; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { padding: 8px 12px; border: 1px solid #000; }
            th { background-color: #f0f0f0; font-weight: bold; text-align: left; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const samplePatient = selectedPatient || {
    id: "1",
    attributes: {
      first_name: "John",
      last_name: "Doe",
      card_id: "h5456432-99",
    },
  };

  const sampleItems =
    selectedItems.length > 0
      ? selectedItems
      : [
          {
            id: "1",
            attributes: { amount: 500, name: "Vitamin C", isPharmacy: true },
            quantity: 1,
            total: 500,
          },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm h-screen overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl h-[90vh] flex flex-col">
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
            ref={receiptRef}
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              lineHeight: "1.4",
              padding: "30px",
              border: "1px solid #ddd",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
                borderBottom: "2px solid #000000",
                paddingBottom: "15px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                  color: "#000000",
                }}
              >
                {hospitalName}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              >
                Payment Receipt
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontSize: "12px",
              }}
            >
              <div>
                <div style={{ color: "#666666", marginBottom: "2px" }}>
                  Receipt No:
                </div>
                <div style={{ fontWeight: "bold", color: "#000000" }}>
                  {receiptNumber}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#666666", marginBottom: "2px" }}>
                  Date:
                </div>
                <div style={{ color: "#000000" }}>
                  {formatDate(paymentDate)}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                marginBottom: "20px",
                border: "1px solid #ddd",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "#000000",
                }}
              >
                Patient Information
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  fontSize: "12px",
                }}
              >
                <div>
                  <div style={{ color: "#666666", marginBottom: "2px" }}>
                    Name:
                  </div>
                  <div style={{ fontWeight: "bold", color: "#000000" }}>
                    {samplePatient.attributes.first_name}{" "}
                    {samplePatient.attributes.last_name}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#666666", marginBottom: "2px" }}>
                    Card ID:
                  </div>
                  <div style={{ fontWeight: "bold", color: "#000000" }}>
                    {samplePatient.attributes.card_id}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "#000000",
                }}
              >
                Payment Details
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        border: "1px solid #000000",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                    >
                      Item
                    </th>
                    <th
                      style={{
                        padding: "8px 12px",
                        textAlign: "center",
                        border: "1px solid #000000",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                    >
                      Qty
                    </th>
                    <th
                      style={{
                        padding: "8px 12px",
                        textAlign: "right",
                        border: "1px solid #000000",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                    >
                      Unit Price
                    </th>
                    <th
                      style={{
                        padding: "8px 12px",
                        textAlign: "right",
                        border: "1px solid #000000",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sampleItems.map((item, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #000000",
                          color: "#000000",
                        }}
                      >
                        {item.attributes.name}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          border: "1px solid #000000",
                          color: "#000000",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          border: "1px solid #000000",
                          color: "#000000",
                        }}
                      >
                        ₦{formatAmount(item.attributes.amount)}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          border: "1px solid #000000",
                          color: "#000000",
                        }}
                      >
                        ₦{formatAmount(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr
                    style={{
                      fontWeight: "bold",
                      borderTop: "2px solid #000000",
                    }}
                  >
                    <td
                      colSpan={3}
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        border: "1px solid #000000",
                        color: "#000000",
                      }}
                    >
                      Total:
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        border: "1px solid #000000",
                        color: "#000000",
                        fontWeight: "bold",
                      }}
                    >
                      ₦{formatAmount(totalAmount)}
                    </td>
                  </tr>

                  {/* Show payment breakdown for all cases (updates or new payments) */}
                  {(isNewPayment || !isNewPayment) && (
                    <>
                      {isPaymentUpdate && (
                        <tr>
                          <td
                            colSpan={3}
                            style={{
                              padding: "8px 12px",
                              textAlign: "right",
                              border: "1px solid #000000",
                              color: "#000000",
                            }}
                          >
                            Previously Paid:
                          </td>
                          <td
                            style={{
                              padding: "8px 12px",
                              textAlign: "right",
                              border: "1px solid #000000",
                              color: "#000000",
                            }}
                          >
                            ₦{formatAmount(previouslyPaid)}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                            fontWeight: "800",
                            fontStyle: "italic",
                          }}
                        >
                          {isPaymentUpdate ? "This Payment:" : "Amount Paid:"}
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#009952",
                            fontWeight: "800",
                            fontStyle: "italic",
                          }}
                        >
                          ₦
                          {formatAmount(
                            isPaymentUpdate ? thisPayment : amountPaid
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                          }}
                        >
                          Total Paid:
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                          }}
                        >
                          ₦
                          {formatAmount(
                            isPaymentUpdate ? totalPaid : amountPaid
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                          }}
                        >
                          Balance:
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                          }}
                        >
                          ₦
                          {formatAmount(
                            isPaymentUpdate ? remainingBalance : balance
                          )}
                        </td>
                      </tr>
                    </>
                  )}

                  {/* Refund section */}
                  {paymentType.includes("refund") &&
                    refundAmount !== undefined && (
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                          }}
                        >
                          Refund Amount:
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                          }}
                        >
                          -₦{formatAmount(refundAmount)}
                        </td>
                      </tr>
                    )}
                </tfoot>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontSize: "12px",
              }}
            >
              <div>
                <div style={{ color: "#666666", marginBottom: "2px" }}>
                  Payment Method:
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    color: "#000000",
                  }}
                >
                  {paymentMethod}
                </div>
              </div>
              <div>
                <div style={{ color: "#666666", marginBottom: "2px" }}>
                  Payment Type:
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    color: "#000000",
                  }}
                >
                  {paymentType === "full"
                    ? "Full Payment"
                    : paymentType === "part"
                    ? "Part Payment"
                    : paymentType === "refunded"
                    ? "Refund"
                    : paymentType}
                </div>
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                borderTop: "1px solid #ddd",
                paddingTop: "15px",
                fontSize: "12px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: "#000000",
                  marginBottom: "5px",
                }}
              >
                Thank you for your payment!
              </div>
              <div style={{ color: "#666666" }}>
                For inquiries, contact {hospitalName} Finance Department.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
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
