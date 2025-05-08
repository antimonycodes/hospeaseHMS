import { JSX, useEffect } from "react";

import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { Loader } from "lucide-react";
import Table from "../../../Shared/Table";
type StockData = {
  item_name: string;
  id: number;
};
type Columns = {
  key: keyof StockData;
  label: string;
  render?: (value: any, stocks: StockData) => JSX.Element;
};

type SaInventoryStockProps = {
  isLoading: boolean;
  categorys: {
    attributes: {
      name: string;
    };
    id: number;
  }[];
};
const SaInventorySettings = ({
  categorys,
  isLoading,
}: SaInventoryStockProps) => {
  const formattedStocks = (categorys || []).map((category) => ({
    id: category.id,
    item_name: category.attributes.name,
  }));
  console.log(categorys, "categorys");

  const columns: Columns[] = [
    {
      key: "item_name",
      label: "Item Name",
      render: (_, category) => <span>{category.item_name}</span>,
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <Table
        data={formattedStocks}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
};

export default SaInventorySettings;
