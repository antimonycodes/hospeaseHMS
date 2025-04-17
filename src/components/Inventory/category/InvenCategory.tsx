import { JSX, useEffect } from "react";
import Table from "../../../Shared/Table";
import { Categories, useInventoryStore } from "../overview/useInventoryStore";

interface InvenCategoryProps {
  categories: Categories[];
  isLoading: boolean;
}

interface FormattedCategory {
  id: number;
  name: string;
}

const InvenCategory: React.FC<InvenCategoryProps> = ({
  categories,
  isLoading,
}) => {
  const { getCategories } = useInventoryStore();

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Define table columns
  type Columns = {
    key: keyof FormattedCategory | "id";
    label: string;
    render?: (value: any, category: FormattedCategory) => JSX.Element;
  };

  const columns: Columns[] = [
    {
      key: "id",
      label: "ID",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Category Name",
      render: (value) => (
        <span className="text-dark font-medium text-sm">{value}</span>
      ),
    },
  ];

  // Flatten categories for the Table component
  const formattedCategories: FormattedCategory[] = categories.map(
    (category) => ({
      id: category.id,
      name: category.attributes?.name || "Unnamed Category",
    })
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {formattedCategories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <Table
          data={formattedCategories}
          columns={columns}
          rowKey="id"
          rowsPerPage={10}
          radius="rounded-none"
        />
      )}
    </div>
  );
};

export default InvenCategory;
