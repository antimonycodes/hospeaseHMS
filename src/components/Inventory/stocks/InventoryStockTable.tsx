interface InventoryStockTableProps {
  stocks: any[];
  isLoading: boolean;
}

const InventoryStockTable: React.FC<InventoryStockTableProps> = ({
  stocks,
  isLoading,
}) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!stocks || stocks.length === 0) {
    return <p>No stocks available.</p>;
  }

  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Item Name</th>
          <th className="border border-gray-300 px-4 py-2">Category</th>
          <th className="border border-gray-300 px-4 py-2">Quantity</th>
          <th className="border border-gray-300 px-4 py-2">Expiration Date</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {stock.item_name}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {stock.category}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {stock.quantity}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {stock.expiration_date}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryStockTable;
