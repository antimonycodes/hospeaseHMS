import React, { useEffect, useState } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import InvenCategory from "./InvenCategory";
import { useInventoryStore } from "../overview/useInventoryStore";
import Category from "../../../pages/Category";
import AddCategoryModal from "../../../Shared/AddCategoryModal";

const InventoryCatTable = () => {
  const { getCategories, categories } = useInventoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    getCategories();
  }, [getCategories]);
  return (
    <div>
      <Tablehead
        tableTitle="Category"
        showButton={true}
        typebutton="Add Category"
        onButtonClick={openModal}
      />
      {isModalOpen && <AddCategoryModal onClose={closeModal} />}
      <InvenCategory categories={categories} isLoading={false} />
    </div>
  );
};

export default InventoryCatTable;
