import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import InvenCategory from "./InvenCategory";
import { useInventoryStore } from "../overview/useInventoryStore";
import AddCategoryModal from "../../../Shared/AddCategoryModal";

const InventoryCatTable = () => {
  const { getAllCategorys, categorys, createCategory, isLoading } =
    useInventoryStore();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getAllCategorys();
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
      {openModal && <AddCategoryModal onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default InventoryCatTable;
