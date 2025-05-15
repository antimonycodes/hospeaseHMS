import { JSX, useEffect, useState } from "react";

import { useInventoryStore } from "../../Inventory/overview/useInventoryStore";
import { Edit, Loader, Trash2 } from "lucide-react";
import Table from "../../../Shared/Table";
type StockData = {
  item_name: string;
  id: number;
};
type Columns = {
  key: keyof StockData | "actions";
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
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-3">
          <button className="text-indigo-600 hover:text-indigo-900">
            <Edit className="w-5 h-5" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
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
