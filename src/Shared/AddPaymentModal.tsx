import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  Trash2,
  Search,
  CreditCard,
  DollarSign,
  User,
  Plus,
  Minus,
  Check,
  Download,
  Printer,
  FileText,
  Camera,
} from "lucide-react";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { useFinanceStore } from "../store/staff/useFinanceStore";
import { usePatientStore } from "../store/super-admin/usePatientStore";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface AddPaymentModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  onClose,
  endpoint = "/finance/save-revenue",
  refreshEndpoint = "/finance/all-revenues",
}) => {
  const { searchPatients, createPayment, isLoading } = useFinanceStore();
  const { getAllPatients } = usePatientStore();
  const { getAllItems, items } = useCombinedStore();

  const [query, setQuery] = useState("");
  const [patientOptions, setPatientOptions] = useState<
    {
      id: string;
      attributes: { first_name: string; last_name: string; card_id: string };
    }[]
  >([]);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    attributes: { first_name: string; last_name: string; card_id: string };
  } | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    {
      id: any;
      attributes: { price: string; name?: string };
      quantity: number;
      total: number;
    }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("items"); // "items" or "payment"
  const [itemSearch, setItemSearch] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllPatients("/medical-report/all-patient");
    getAllItems("/finance/purpose/all");
  }, [getAllPatients, getAllItems]);

  const handleSearch = debounce(async (val) => {
    if (val.length > 2) {
      const results = await searchPatients(val);
      setPatientOptions(results || []);
    } else {
      setPatientOptions([]);
    }
  }, 300);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (name === "query") {
      setQuery(value);
      handleSearch(value);
    } else if (name === "payment_method") {
      setPaymentMethod(value);
    } else if (name === "payment_type") {
      setPaymentType(value);
    } else if (name === "itemSearch") {
      setItemSearch(value);
    }
  };

  const handleSelectPatient = (patient: {
    id: string;
    attributes: { first_name: string; last_name: string; card_id: string };
  }) => {
    setSelectedPatient(patient);
    setQuery(
      `${patient?.attributes.first_name} ${patient.attributes.last_name}`
    );
    setPatientOptions([]);
  };

  const handleToggleItem = (item: {
    id: any;
    attributes: { price: string; name?: string };
  }) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (!exists) {
      setSelectedItems((prev) => [
        ...prev,
        { ...item, quantity: 1, total: parseFloat(item.attributes.price) },
      ]);
      toast.success(`Added ${item.attributes.name || "item"} to selection`);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success(`Removed ${item.attributes.name || "item"} from selection`);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      item.quantity = Math.max(1, item.quantity + delta);
      item.total = parseFloat(item.attributes.price) * item.quantity;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    const itemName = selectedItems[index].attributes.name || "Item";
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed ${itemName} from selection`);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async () => {
    // Format the payload according to the expected backend structure
    const payload = {
      payments: selectedItems.map((item) => ({
        amount: item.total.toString(),
        purpose_id: item.id,
        patient_id: selectedPatient?.id ? Number(selectedPatient.id) : 0,
        payment_method: paymentMethod,
        payment_type: paymentType,
      })),
    };

    try {
      const success = await createPayment(payload, endpoint);
      if (success) {
        // Generate receipt number and set payment date
        setReceiptNumber(`RCP${Date.now().toString().slice(-8)}`);
        setPaymentDate(new Date());
        setPaymentComplete(true);
        setShowSummary(false);
        toast.success("Payment successfully processed");
      }
    } catch (error) {
      toast.error("Payment processing failed");
    }
  };

  const handleDownloadPDF = () => {
    if (!receiptRef.current) return;

    toast.loading("Generating PDF...");

    const receiptElement = receiptRef.current;

    html2canvas(receiptElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Receipt-${receiptNumber}.pdf`);

      toast.dismiss();
      toast.success("Receipt downloaded as PDF");
    });
  };

  const handleDownloadImage = () => {
    if (!receiptRef.current) return;

    toast.loading("Generating image...");

    html2canvas(receiptRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Receipt-${receiptNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.dismiss();
      toast.success("Receipt downloaded as image");
    });
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print receipt");
      return;
    }

    const receiptHtml = receiptRef.current.outerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt - ${receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt { max-width: 100%; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${receiptHtml}
          </div>
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isSubmitDisabled =
    selectedItems.length === 0 ||
    !selectedPatient ||
    !paymentMethod ||
    !paymentType;

  const filteredItems = items.filter((item) =>
    item.attributes.name?.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const isItemSelected = (id: any) =>
    selectedItems.some((item) => item.id === id);

  // If payment is complete, show receipt with download options
  if (paymentComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              Payment Receipt
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Receipt Content */}
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

            {/* Receipt */}
            {/* <div
              ref={receiptRef}
              className="border rounded-lg shadow p-6 bg-white"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    PAYMENT RECEIPT
                  </h1>
                  <p className="text-gray-500">Receipt #: {receiptNumber}</p>
                  {paymentDate && (
                    <p className="text-gray-500">
                      Date: {formatDate(paymentDate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h3 className="font-bold mb-2">Patient Information</h3>
                {selectedPatient && (
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedPatient.attributes.first_name}{" "}
                      {selectedPatient.attributes.last_name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Card ID:</span>{" "}
                      {selectedPatient.attributes.card_id}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">Payment Details</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Description</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2">Unit Price</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.attributes.name}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">₦{item.attributes.price}</td>
                        <td className="py-2 text-right">
                          ₦{item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Payment Method:</span>{" "}
                    <span className="capitalize">{paymentMethod}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Payment Type:</span>{" "}
                    <span className="capitalize">{paymentType}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    Total: ₦{totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t text-center text-gray-500 text-sm">
                <p>Thank you for your payment</p>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl h-[90%] rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">New Payment</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Patient Search Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Information
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                name="query"
                value={query}
                onChange={handleChange}
                placeholder="Search patient by name or card ID..."
                className="w-full border pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            {patientOptions.length > 0 && (
              <ul className="mt-1 bg-white border rounded-lg shadow-lg overflow-hidden">
                {patientOptions.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center"
                  >
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">
                        {p.attributes.first_name} {p.attributes.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Card ID: {p.attributes.card_id}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {selectedPatient && (
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center">
                <User className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium">
                    {selectedPatient.attributes.first_name}{" "}
                    {selectedPatient.attributes.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Card ID: {selectedPatient.attributes.card_id}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("items")}
                className={`py-3 border-b-2 font-medium ${
                  activeTab === "items"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Select Items
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`py-3 border-b-2 font-medium ${
                  activeTab === "payment"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Payment Details
              </button>
            </div>
          </div>

          {activeTab === "items" ? (
            <>
              {/* Items Multi-Select Section */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-gray-700">
                  Select Items (Multiple)
                </h3>

                {/* Custom Select Component */}
                <div className="relative mb-4">
                  <div
                    className="border rounded-lg p-3 flex items-center justify-between cursor-pointer"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    <div className="flex-1">
                      {selectedItems.length === 0 ? (
                        <span className="text-gray-500">Select items...</span>
                      ) : (
                        <span>{selectedItems.length} item(s) selected</span>
                      )}
                    </div>
                    <div
                      className={`transform transition-transform ${
                        isSelectOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {isSelectOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2 sticky top-0 bg-white border-b">
                        <input
                          type="search"
                          name="itemSearch"
                          value={itemSearch}
                          onChange={handleChange}
                          placeholder="Search items..."
                          className="w-full border p-2 rounded"
                        />
                      </div>
                      <ul className="divide-y">
                        {filteredItems.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => handleToggleItem(item)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">
                                {item.attributes.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                ₦{item.attributes.price}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isItemSelected(item.id)
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {isItemSelected(item.id) && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-700">
                    Selected Items
                  </h3>
                  <ul className="bg-white border rounded-lg divide-y">
                    {selectedItems.map((item, index) => (
                      <li
                        key={index}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.attributes.name}</p>
                          <p className="text-sm text-gray-500">
                            ₦{item.attributes.price} per unit
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-medium text-green-600 w-24 text-right">
                            ₦{item.total}
                          </p>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            /* Payment Details Tab */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["cash", "cheque", "transfer"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center justify-center border px-4 py-3 rounded-lg hover:bg-gray-50 ${
                        paymentMethod === method
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {method === "cash" && (
                        <DollarSign className="h-5 w-5 mr-2" />
                      )}
                      {method === "cheque" && (
                        <CreditCard className="h-5 w-5 mr-2" />
                      )}
                      {method === "transfer" && (
                        <CreditCard className="h-5 w-5 mr-2" />
                      )}
                      <span className="capitalize">{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["half payment", "full payment"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPaymentType(type)}
                      className={`border px-4 py-3 rounded-lg hover:bg-gray-50 ${
                        paymentType === type
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Order Summary
                  </h4>
                  <ul className="space-y-2 mb-3">
                    {selectedItems.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>
                          {item.attributes.name} × {item.quantity}
                        </span>
                        <span className="font-medium">₦{item.total}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₦{totalAmount}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div>
            <p className="text-xl font-bold text-green-600">
              Total: ₦{totalAmount}
            </p>
            {selectedItems.length > 0 && (
              <p className="text-sm text-gray-500">
                {selectedItems.length} item(s)
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            {activeTab === "items" ? (
              <button
                onClick={() => setActiveTab("payment")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center"
                disabled={selectedItems.length === 0}
              >
                Continue to Payment
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("items")}
                  className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setShowSummary(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitDisabled}
                >
                  Process Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Confirm Payment</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-500 mb-3">Patient</p>
              <p className="font-medium">
                {selectedPatient?.attributes.first_name}{" "}
                {selectedPatient?.attributes.last_name}
              </p>
              <p className="text-sm text-gray-500">
                Card ID: {selectedPatient?.attributes.card_id}
              </p>
            </div>

            <ul className="mb-4 divide-y">
              {selectedItems.map((item, index) => (
                <li key={index} className="flex justify-between py-2">
                  <span className="text-gray-700">
                    {item.attributes.name} × {item.quantity}
                  </span>
                  <span className="font-medium">₦{item.total}</span>
                </li>
              ))}
            </ul>

            <div className="border-t pt-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Amount</span>
                <span className="text-xl font-bold text-green-600">
                  ₦{totalAmount}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                <span>Payment Method</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                <span>Payment Type</span>
                <span className="capitalize">{paymentType}</span>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSummary(false)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center min-w-32"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPaymentModal;
