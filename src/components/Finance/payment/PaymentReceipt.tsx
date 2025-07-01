// import React, { useRef, useState } from "react";
// import { FileText, Camera, Printer, X } from "lucide-react";

// interface Patient {
//   id: string;
//   attributes: { first_name: string; last_name: string; card_id: string };
// }

// interface Item {
//   id: string | number;
//   attributes: {
//     amount: number;
//     name: string;
//     isPharmacy: boolean;
//     availableQuantity?: number;
//   };
//   quantity: number;
//   total: number;
// }

// interface PaymentReceiptProps {
//   onClose: () => void;
//   receiptNumber: string;
//   paymentDate: Date | null;
//   selectedPatient: Patient | null;
//   selectedItems: Item[];
//   totalAmount: number;
//   paymentMethod: string;
//   paymentType: string;
//   partAmount?: number;
// }

// const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
//   onClose,
//   receiptNumber,
//   paymentDate,
//   selectedPatient,
//   selectedItems,
//   totalAmount,
//   paymentMethod,
//   paymentType,
//   partAmount,
// }) => {
//   const receiptRef = useRef<HTMLDivElement>(null);
//   const [logoError, setLogoError] = useState(false);
//   const hName = localStorage.getItem("hospitalName");
//   console.log(hName);

//   const hospitalName = hName;
//   const hospitalLogoPath = "";

//   const formatAmount = (amount: number): string => {
//     return amount.toLocaleString("en-NG", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };

//   const formatDate = (date: Date | null): string => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-NG", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   console.log(selectedPatient, "selectedPatient");

//   const handleDownloadPDF = async () => {
//     if (!receiptRef.current) return;

//     try {
//       // Dynamically import html2canvas and jsPDF
//       const html2canvas = (await import("html2canvas")).default;
//       const jsPDF = (await import("jspdf")).default;

//       const canvas = await html2canvas(receiptRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: "#ffffff",
//         logging: false,
//         width: receiptRef.current.scrollWidth,
//         height: receiptRef.current.scrollHeight,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 190;
//       const pageHeight = 295;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 10;

//       pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight + 10;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`Receipt-${receiptNumber}.pdf`);
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//       handlePrint();
//     }
//   };

//   const handleDownloadImage = async () => {
//     if (!receiptRef.current) return;

//     try {
//       const html2canvas = (await import("html2canvas")).default;

//       const canvas = await html2canvas(receiptRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: "#ffffff",
//         logging: false,
//         width: receiptRef.current.scrollWidth,
//         height: receiptRef.current.scrollHeight,
//       });

//       const link = document.createElement("a");
//       link.download = `Receipt-${receiptNumber}.png`;
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     } catch (error) {
//       console.error("Image generation failed:", error);
//     }
//   };

//   const handlePrint = () => {
//     if (!receiptRef.current) return;

//     const printWindow = window.open("", "_blank");
//     if (!printWindow) {
//       console.error("Failed to open print window");
//       return;
//     }

//     const printContent = receiptRef.current.innerHTML;
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Print Receipt ${receiptNumber}</title>
//           <style>
//             * {
//               margin: 0;
//               padding: 0;
//               box-sizing: border-box;
//             }

//             body {
//               font-family: Arial, sans-serif;
//               font-size: 14px;
//               line-height: 1.4;
//               color: #000;
//               background: white;
//               padding: 20px;
//             }

//             .receipt-container {
//               max-width: 800px;
//               margin: 0 auto;
//               background: white;
//               padding: 20px;
//               border: 1px solid #ddd;
//             }

//             .receipt-header {
//               text-align: center;
//               margin-bottom: 30px;
//               border-bottom: 2px solid #000;
//               padding-bottom: 15px;
//             }

//             .hospital-name {
//               font-size: 24px;
//               font-weight: bold;
//               margin-bottom: 5px;
//             }

//             .receipt-title {
//               font-size: 18px;
//               font-weight: bold;
//             }

//             .receipt-info {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 20px;
//               font-size: 12px;
//             }

//             .patient-info {
//               background: #f8f9fa;
//               padding: 15px;
//               margin-bottom: 20px;
//               border: 1px solid #ddd;
//             }

//             .patient-info h3 {
//               font-size: 14px;
//               font-weight: bold;
//               margin-bottom: 10px;
//             }

//             .patient-details {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 15px;
//             }

//             .patient-details div {
//               font-size: 12px;
//             }

//             .patient-details .label {
//               color: #666;
//               margin-bottom: 2px;
//             }

//             .patient-details .value {
//               font-weight: bold;
//               color: #000;
//             }

//             .payment-details h3 {
//               font-size: 14px;
//               font-weight: bold;
//               margin-bottom: 10px;
//             }

//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-bottom: 20px;
//             }

//             th, td {
//               padding: 8px 12px;
//               text-align: left;
//               border: 1px solid #000;
//               font-size: 12px;
//             }

//             th {
//               background-color: #f0f0f0;
//               font-weight: bold;
//             }

//             .text-center { text-align: center; }
//             .text-right { text-align: right; }

//             .total-row {
//               font-weight: bold;
//               border-top: 2px solid #000;
//             }

//             .payment-method {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 20px;
//               font-size: 12px;
//             }

//             .payment-method div {
//               margin-right: 20px;
//             }

//             .payment-method .label {
//               color: #666;
//               margin-bottom: 2px;
//             }

//             .payment-method .value {
//               font-weight: bold;
//               text-transform: capitalize;
//             }

//             .footer {
//               text-align: center;
//               border-top: 1px solid #ddd;
//               padding-top: 15px;
//               font-size: 12px;
//               color: #666;
//             }

//             .footer .thank-you {
//               font-weight: bold;
//               color: #000;
//               margin-bottom: 5px;
//             }

//             @media print {
//               body {
//                 font-size: 12px;
//                 padding: 10px;
//               }

//               .receipt-container {
//                 padding: 10px;
//                 border: none;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="receipt-container">
//             ${printContent}
//           </div>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();

//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 250);
//   };

//   // Sample data for demonstration
//   const samplePatient = selectedPatient || {
//     id: "1",
//     attributes: {
//       first_name: "John",
//       last_name: "Doe",
//       card_id: "h5456432-99",
//     },
//   };

//   const sampleItems =
//     selectedItems.length > 0
//       ? selectedItems
//       : [
//           {
//             id: "1",
//             attributes: {
//               amount: 500,
//               name: "Vitamin C",
//               isPharmacy: true,
//             },
//             quantity: 1,
//             total: 500,
//           },
//         ];

//   const sampleTotal = totalAmount || 500;
//   const sampleReceiptNumber = receiptNumber || "RCP40467604";
//   const sampleDate = paymentDate || new Date("2025-06-17T07:07:00");
//   const samplePaymentMethod = paymentMethod || "pos";
//   const samplePaymentType = paymentType || "full";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm h-screen overflow-y-auto">
//       <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl h-[90vh] flex flex-col">
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-800">Payment Receipt</h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             aria-label="Close receipt"
//           >
//             <X className="h-5 w-5 text-gray-600" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6">
//           <div className="mb-6 flex justify-end space-x-3">
//             <button
//               onClick={handleDownloadPDF}
//               className="flex items-center text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-lg transition-colors"
//               aria-label="Download receipt as PDF"
//             >
//               <FileText className="h-4 w-4 mr-2" />
//               PDF
//             </button>
//             <button
//               onClick={handleDownloadImage}
//               className="flex items-center text-green-600 hover:text-green-800 px-4 py-2 border border-green-600 rounded-lg transition-colors"
//               aria-label="Download receipt as image"
//             >
//               <Camera className="h-4 w-4 mr-2" />
//               Image
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-600 rounded-lg transition-colors"
//               aria-label="Print receipt"
//             >
//               <Printer className="h-4 w-4 mr-2" />
//               Print
//             </button>
//           </div>

//           {/* Receipt content - optimized for all export formats */}
//           <div
//             ref={receiptRef}
//             style={{
//               backgroundColor: "#ffffff",
//               color: "#000000",
//               fontFamily: "Arial, sans-serif",
//               fontSize: "14px",
//               lineHeight: "1.4",
//               padding: "30px",
//               border: "1px solid #ddd",
//               maxWidth: "800px",
//               margin: "0 auto",
//             }}
//           >
//             {/* Receipt Header */}
//             <div
//               style={{
//                 textAlign: "center",
//                 marginBottom: "30px",
//                 borderBottom: "2px solid #000000",
//                 paddingBottom: "15px",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "24px",
//                   fontWeight: "bold",
//                   marginBottom: "5px",
//                   color: "#000000",
//                 }}
//               >
//                 {hospitalName}
//               </div>
//               <div
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   color: "#000000",
//                 }}
//               >
//                 Payment Receipt
//               </div>
//             </div>

//             {/* Receipt Info */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: "20px",
//                 fontSize: "12px",
//               }}
//             >
//               <div>
//                 <div style={{ color: "#666666", marginBottom: "2px" }}>
//                   Receipt No:
//                 </div>
//                 <div style={{ fontWeight: "bold", color: "#000000" }}>
//                   {sampleReceiptNumber}
//                 </div>
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div style={{ color: "#666666", marginBottom: "2px" }}>
//                   Date:
//                 </div>
//                 <div style={{ color: "#000000" }}>{formatDate(sampleDate)}</div>
//               </div>
//             </div>

//             {/* Patient Info */}
//             <div
//               style={{
//                 backgroundColor: "#f8f9fa",
//                 padding: "15px",
//                 marginBottom: "20px",
//                 border: "1px solid #ddd",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                   marginBottom: "10px",
//                   color: "#000000",
//                 }}
//               >
//                 Patient Information
//               </div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: "15px",
//                   fontSize: "12px",
//                 }}
//               >
//                 <div>
//                   <div style={{ color: "#666666", marginBottom: "2px" }}>
//                     Name:
//                   </div>
//                   <div style={{ fontWeight: "bold", color: "#000000" }}>
//                     {samplePatient.attributes.first_name}{" "}
//                     {samplePatient.attributes.last_name}
//                   </div>
//                 </div>
//                 <div>
//                   <div style={{ color: "#666666", marginBottom: "2px" }}>
//                     Card ID:
//                   </div>
//                   <div style={{ fontWeight: "bold", color: "#000000" }}>
//                     {samplePatient.attributes.card_id}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Details */}
//             <div style={{ marginBottom: "20px" }}>
//               <div
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                   marginBottom: "10px",
//                   color: "#000000",
//                 }}
//               >
//                 Payment Details
//               </div>

//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: "12px",
//                 }}
//               >
//                 <thead>
//                   <tr style={{ backgroundColor: "#f0f0f0" }}>
//                     <th
//                       style={{
//                         padding: "8px 12px",
//                         textAlign: "left",
//                         border: "1px solid #000000",
//                         fontWeight: "bold",
//                         color: "#000000",
//                       }}
//                     >
//                       Item
//                     </th>
//                     <th
//                       style={{
//                         padding: "8px 12px",
//                         textAlign: "center",
//                         border: "1px solid #000000",
//                         fontWeight: "bold",
//                         color: "#000000",
//                       }}
//                     >
//                       Qty
//                     </th>
//                     <th
//                       style={{
//                         padding: "8px 12px",
//                         textAlign: "right",
//                         border: "1px solid #000000",
//                         fontWeight: "bold",
//                         color: "#000000",
//                       }}
//                     >
//                       Unit Price
//                     </th>
//                     <th
//                       style={{
//                         padding: "8px 12px",
//                         textAlign: "right",
//                         border: "1px solid #000000",
//                         fontWeight: "bold",
//                         color: "#000000",
//                       }}
//                     >
//                       Amount
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sampleItems.map((item, index) => (
//                     <tr key={index}>
//                       <td
//                         style={{
//                           padding: "8px 12px",
//                           border: "1px solid #000000",
//                           color: "#000000",
//                         }}
//                       >
//                         {item.attributes.name}
//                       </td>
//                       <td
//                         style={{
//                           padding: "8px 12px",
//                           textAlign: "center",
//                           border: "1px solid #000000",
//                           color: "#000000",
//                         }}
//                       >
//                         {item.quantity}
//                       </td>
//                       <td
//                         style={{
//                           padding: "8px 12px",
//                           textAlign: "right",
//                           border: "1px solid #000000",
//                           color: "#000000",
//                         }}
//                       >
//                         ₦{formatAmount(item.attributes.amount)}
//                       </td>
//                       <td
//                         style={{
//                           padding: "8px 12px",
//                           textAlign: "right",
//                           border: "1px solid #000000",
//                           color: "#000000",
//                         }}
//                       >
//                         ₦{formatAmount(item.total)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr
//                     style={{
//                       fontWeight: "bold",
//                       borderTop: "2px solid #000000",
//                     }}
//                   >
//                     <td
//                       colSpan={3}
//                       style={{
//                         padding: "12px",
//                         textAlign: "right",
//                         border: "1px solid #000000",
//                         color: "#000000",
//                       }}
//                     >
//                       Total:
//                     </td>
//                     <td
//                       style={{
//                         padding: "12px",
//                         textAlign: "right",
//                         border: "1px solid #000000",
//                         color: "#000000",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       ₦{formatAmount(sampleTotal)}
//                     </td>
//                   </tr>
//                   {samplePaymentType === "part" && partAmount !== undefined && (
//                     <>
//                       <tr>
//                         <td
//                           colSpan={3}
//                           style={{
//                             padding: "8px 12px",
//                             textAlign: "right",
//                             border: "1px solid #000000",
//                             color: "#000000",
//                           }}
//                         >
//                           Amount Paid:
//                         </td>
//                         <td
//                           style={{
//                             padding: "8px 12px",
//                             textAlign: "right",
//                             border: "1px solid #000000",
//                             color: "#000000",
//                           }}
//                         >
//                           ₦{formatAmount(partAmount)}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td
//                           colSpan={3}
//                           style={{
//                             padding: "8px 12px",
//                             textAlign: "right",
//                             border: "1px solid #000000",
//                             color: "#000000",
//                           }}
//                         >
//                           Balance:
//                         </td>
//                         <td
//                           style={{
//                             padding: "8px 12px",
//                             textAlign: "right",
//                             border: "1px solid #000000",
//                             color: "#000000",
//                           }}
//                         >
//                           ₦{formatAmount(sampleTotal - partAmount)}
//                         </td>
//                       </tr>
//                     </>
//                   )}
//                 </tfoot>
//               </table>
//             </div>

//             {/* Payment Method */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: "20px",
//                 fontSize: "12px",
//               }}
//             >
//               <div>
//                 <div style={{ color: "#666666", marginBottom: "2px" }}>
//                   Payment Method:
//                 </div>
//                 <div
//                   style={{
//                     fontWeight: "bold",
//                     textTransform: "capitalize",
//                     color: "#000000",
//                   }}
//                 >
//                   {samplePaymentMethod}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ color: "#666666", marginBottom: "2px" }}>
//                   Payment Type:
//                 </div>
//                 <div
//                   style={{
//                     fontWeight: "bold",
//                     textTransform: "capitalize",
//                     color: "#000000",
//                   }}
//                 >
//                   {samplePaymentType === "full"
//                     ? "Full Payment"
//                     : "Part Payment"}
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div
//               style={{
//                 textAlign: "center",
//                 borderTop: "1px solid #ddd",
//                 paddingTop: "15px",
//                 fontSize: "12px",
//               }}
//             >
//               <div
//                 style={{
//                   fontWeight: "bold",
//                   color: "#000000",
//                   marginBottom: "5px",
//                 }}
//               >
//                 Thank you for your payment!
//               </div>
//               <div style={{ color: "#666666" }}>
//                 For inquiries, contact {hospitalName} Finance Department.
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end p-6 border-t bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-6 py-3 bg-primary text-white rounded-lg font-medium "
//             aria-label="Close receipt modal"
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentReceipt;

import React, { useRef, useState, useEffect } from "react";
import { FileText, Camera, Printer, X } from "lucide-react";
import { useFinanceStore } from "../../../store/staff/useFinanceStore";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../../Shared/Button";
import Loader from "../../../Shared/Loader";

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
  refundAmount?: number;
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
  refundAmount,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [logoError, setLogoError] = useState(false);
  const hName = localStorage.getItem("hospitalName");

  const hospitalName = hName || "Hospital Name";
  const hospitalLogoPath = "";

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
            /* [Previous CSS styles remain unchanged] */
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
                  {paymentType === "part" && partAmount !== undefined && (
                    <>
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
                          Amount Paid:
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            border: "1px solid #000000",
                            color: "#000000",
                          }}
                        >
                          ₦{formatAmount(partAmount)}
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
                          ₦{formatAmount(totalAmount - partAmount)}
                        </td>
                      </tr>
                    </>
                  )}
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
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium "
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
