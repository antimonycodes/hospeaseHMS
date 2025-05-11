import React, { useEffect, useState } from "react";
import Tabs from "../../ReusablepatientD/Tabs";
import SaInventoryDash from "./SaInventoryDash";
import SaInventoryStock from "./SaInventoryStock";
import Tablehead from "../../ReusablepatientD/Tablehead";
import Button from "../../../Shared/Button";
import { Plus } from "lucide-react";
import AddStockModal from "../../Inventory/stocks/AddStockModal";
import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import SaInventoryRequest from "./SaInventoryRequest";
import AddRequestModal from "../../Inventory/request/AddRequestModal";
import SaInventorySettings from "./SaInventorySettings";
import AddItemModal from "../../../Shared/AddItemModal";
import AddCategoryModal from "../../../Shared/AddCategoryModal";

const SaInventoryPage = () => {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Stock" | "Requests" | "Settings"
  >("Overview");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    getAllStocks,
    stocks,
    isLoading,
    createStock,
    createCategory,
    getAllCategorys,
    categorys,
  } = useInventoryStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const openRequest = () => setIsRequestOpen(true);
  const closeRequest = () => setIsRequestOpen(false);

  const [isItemOpen, setIsItemsOpen] = useState(false);

  const openItem = () => setIsItemsOpen(true);
  const closeItem = () => setIsItemsOpen(false);

  const [isCategoryOpen, setisCategoryOpen] = useState<boolean>(false);
  const openCategory = () => setisCategoryOpen(true);
  const closeCategory = () => setisCategoryOpen(false);
  const renderButtons = () => {
    if (activeTab === "Stock") {
      return (
        <Button
          variant="primary"
          className="flex items-center text-[12px] gap-2 px-2 md:px-4"
          onClick={openModal}
        >
          Add Stock
          <Plus size={20} />
        </Button>
      );
    }
    if (activeTab === "Requests") {
      return (
        <Button
          variant="primary"
          className="flex items-center text-[12px] gap-2 px-2 md:px-4"
          onClick={openRequest}
        >
          Add Request
          <Plus size={20} />
        </Button>
      );
    }
    if (activeTab === "Settings") {
      return (
        <div className="flex gap-2">
          {/* <Button
            variant="primary"
            className="flex items-center text-[12px] gap-2 px-2 md:px-4"
            onClick={openItem}
          >
            Add Item
            <Plus size={20} />
          </Button> */}
          <Button
            variant="primary"
            className="flex items-center text-[12px] gap-2 px-2 md:px-4"
            onClick={openCategory}
          >
            Add Category
            <Plus size={20} />
          </Button>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    getAllStocks("/admin/inventory/all-inventory-items");
    getAllCategorys("/admin/inventory/category/all-records");
  }, [getAllStocks]);
  // console.log("fetched", stocks);

  return (
    <div>
      <div className=" flex flex-col gap-4 md:flex-row w-full bg-white pt-10 pb-3 pr-2 md:pr-4 rounded-xl custom-shadow  ">
        <Tabs<"Overview" | "Stock" | "Requests" | "Settings">
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={["Overview", "Stock", "Requests", "Settings"]}
        />

        <div className="flex justify-end w-full md:max-w-2xl">
          {renderButtons()}
        </div>
      </div>
      <div className="mt-3">
        {activeTab === "Overview" && <SaInventoryDash />}
        {activeTab === "Stock" && (
          <SaInventoryStock stocks={stocks} isLoading={isLoading} />
        )}
        {activeTab === "Requests" && <SaInventoryRequest />}
        {activeTab === "Settings" && (
          <SaInventorySettings categorys={categorys} isLoading={isLoading} />
        )}
      </div>
      {isModalOpen && (
        <AddStockModal
          onClose={closeModal}
          isLoading={isLoading}
          createStock={createStock}
          endpoint="/admin/inventory/upload-item"
          refreshEndpoint="/admin/inventory/all-inventory-items"
          fetchEndpoint="/admin/inventory/all-inventory-items"
          createEndpoint="/admin/inventory/category/create"
        />
      )}
      {isRequestOpen && (
        <AddRequestModal
          onClose={closeRequest}
          endpoint="/admin/inventory/requests/create"
          refreshEndpoint="/medical-report/department-request-records"
          fetchEndpoint="/medical-report/department-request-records"
          stockEndpoint="/admin/inventory/all-inventory-items"
        />
      )}
      {isItemOpen && (
        <AddItemModal
          onClose={closeItem}
          createStock={createStock}
          isLoading={isLoading}
          endpoint="/admin/inventory/upload-item"
          refreshEndpoint="/admin/inventory/all-inventory-items"
          fetchEndpoint="/admin/inventory/category/all-records"
          createEndpoint="/admin/inventory/category/create"
        />
      )}
      {isCategoryOpen && (
        <AddCategoryModal
          createEndpoint="/admin/inventory/category/create"
          Catendpoint="/admin/inventory/category/all-records"
          onClose={closeCategory}
          createCategory={createCategory}
        />
      )}
    </div>
  );
};

export default SaInventoryPage;
