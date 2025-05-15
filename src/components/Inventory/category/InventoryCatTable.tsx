import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import InvenCategory from "./InvenCategory";
import { useInventoryStore } from "../overview/useInventoryStore";
import AddCategoryModal from "../../../Shared/AddCategoryModal";

const InventoryCatTable = () => {
  const { getAllCategorys, categorys, createCategory, isLoading } =
    useInventoryStore();
  const [openModal, setOpenModal] = useState(false);
  const [isCategoryOpen, setisCategoryOpen] = useState<boolean>(false);
  const openCategory = () => setisCategoryOpen(true);
  const closeCategory = () => setisCategoryOpen(false);
  useEffect(() => {
    getAllCategorys("/inventory/category/all-records");
  }, [getAllCategorys]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div>
      <Tablehead
        tableTitle="Category"
        showButton={true}
        typebutton="Add Category"
        showControls={false}
        showSearchBar={false}
        onButtonClick={handleOpenModal}
      />
      <InvenCategory categorys={categorys} isLoading={isLoading} />
      {isCategoryOpen && (
        <AddCategoryModal
          createEndpoint="/inventory/category/create"
          Catendpoint="/inventory/category/all-records"
          onClose={closeCategory}
          createCategory={createCategory}
        />
      )}
    </div>
  );
};

export default InventoryCatTable;
