import { JSX, useEffect } from "react";
import Tablehead from "../../ReusablepatientD/Tablehead";
import { useInventoryStore } from "../overview/useInventoryStore";
import Table from "../../../Shared/Table";
import Loader from "../../../Shared/Loader";

type InventoryData = {
  name: string;
  id: number;
};

type Columns = {
  key: keyof InventoryData;
  label: string;
  render?: (value: any, category: InventoryData) => JSX.Element;
};

type InventoryDataProps = {
  isLoading: boolean;
  categorys: {
    attributes: {
      name: string;
    };
    id: number;
  }[];
};

const InvenCategory = ({ categorys, isLoading }: InventoryDataProps) => {
  // const { getAllCategorys } = useInventoryStore();

  const formattedCategorys = (categorys || []).map((category) => ({
    id: category.id,
    name: category.attributes.name,
  }));

  const columns: Columns[] = [
    {
      key: "name",
      label: "Category Name",
      render: (_, category) => <span>{category.name}</span>,
    },
  ];

  if (isLoading) return <Loader />;
  return (
    <div>
      <Table
        data={formattedCategorys}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
};

export default InvenCategory;
