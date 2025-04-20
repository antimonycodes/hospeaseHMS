import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import InventoryCatTable from "../components/Inventory/category/InventoryCatTable";

const roleComponents: Record<string, JSX.Element> = {
  "inventory-manager": <InventoryCatTable />,
};
const Category = () => {
  const navigate = useNavigate();
  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Category;
