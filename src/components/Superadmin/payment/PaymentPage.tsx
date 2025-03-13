import { Plus } from "lucide-react";
import Button from "../../../Shared/Button";
import PaymentTable from "./PaymentTable";
import { useState } from "react";
import AddPaymentModal from "./AddPaymentModal";

const PaymentPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h1 className=" text-custom-black text-xl font-medium mb-4">Payments</h1>
      {/* Accunt details */}
      <div className=" bg-white border-[1.67px] border-gray-200 rounded-[16.65px] p-4 md:p-8 lg:p-12">
        <h1 className=" text-custom-black font-medium text-xl">
          Account Number: <span className=" text-primary">9065334643</span>
        </h1>
        <h1 className=" text-custom-black font-medium text-xl">
          Account Name: <span className="">Hospease ltd</span>
        </h1>
        <h1 className=" text-custom-black font-medium text-xl">
          Bank Name: <span className="">First Bank Plc</span>
        </h1>
      </div>
      {/*payment history  */}
      <div className=" bg-white py-5 px-4 flex flex-col 2xs:flex-row gap-4 justify-between my-4">
        <h1 className=" text-[#667085] font-medium ">Payment History</h1>
        <Button onClick={() => setShowModal(true)}>
          Make new Payment
          <Plus />
        </Button>
      </div>
      {/* payment table */}
      <PaymentTable />

      {/* modal */}
      {showModal && (
        <AddPaymentModal
          // isOpen={modalOpen}
          // onClose={() => setModalOpen(false)}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default PaymentPage;
