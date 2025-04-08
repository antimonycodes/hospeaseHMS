import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Table from "../../../Shared/Table";
import AddRequestModal from "./AddRequestModal";
import axios from "axios";

const InventoryRequest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "/inventory/requests/all-records?status=pending"
      );
      setRequests(response.data.data); // Assuming the API returns data in this structure
    } catch (error: any) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    {
      key: "requested_by",
      label: "Requested By",
      render: (value: string) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "inventory_id",
      label: "Inventory ID",
      render: (value: string) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (value: number) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span className="text-[#667085] text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div>
      <Tablehead
        typebutton="Add New"
        tableTitle="Requests"
        onButtonClick={openModal}
        showButton={true}
      />
      {isModalOpen && (
        <AddRequestModal
          onClose={() => {
            closeModal();
            fetchRequests(); // Refresh the requests after adding a new one
          }}
          formData={{
            itemName: "",
            category: "",
            purchaseCost: "",
            quantity: "",
          }}
        />
      )}
      <div className="w-full bg-white rounded-b-[8px] shadow-table">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            data={requests}
            columns={columns}
            rowKey="id"
            pagination={requests.length > 10}
            rowsPerPage={10}
            radius="rounded-none"
          />
        )}
      </div>
    </div>
  );
};

export default InventoryRequest;
