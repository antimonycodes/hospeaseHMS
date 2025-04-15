import { useState, useEffect, useRef, SetStateAction } from "react";
import Button from "../Shared/Button";
import { XIcon, PlusCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { useGlobalStore } from "../store/super-admin/useGlobal";
import toast from "react-hot-toast";
import Loader from "../Shared/Loader";
import { useCombinedStore } from "../store/super-admin/useCombinedStore";

const ServiceCharges = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  interface Item {
    id: string;
    attributes: {
      name: string;
      price: number;
    };
  }

  const [editItem, setEditItem] = useState<Item | null>(null);

  //   // These would be from your global store
  const { isLoading, createItem, getAllItems, items } = useCombinedStore();

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  console.log(items);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim();
    const price = priceRef.current?.value;

    if (!name || !price) {
      toast.error("Name and price are required");
      return;
    }

    const itemData = {
      name,
      price: parseFloat(price),
    };

    let result;
    if (isEditMode) {
      // result = await updateItem({ id: editItem.id, ...itemData });
      // if (result) toast.success("Item updated successfully");
    } else {
      result = await createItem(itemData);
    }

    if (result) {
      resetForm();
      setIsModalOpen(false);
    }
  };

  //   const handleDeleteItem = async (id) => {
  //     if (window.confirm("Are you sure you want to delete this item?")) {
  //       const result = await deleteItem(id);
  //       if (result) {
  //         toast.success("Item deleted successfully");
  //       }
  //     }
  //   };

  // const openEditModal = (item: Item | null) => {
  //   setEditItem(item);
  //   setIsEditMode(true);
  //   setIsModalOpen(true);
  // };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    if (nameRef.current) nameRef.current.value = "";
    if (priceRef.current) priceRef.current.value = "";
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  if (isLoading) return <Loader />;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            Services & Charges
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all billable items and services
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                S/N
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Item Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              {/* <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading && items?.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.attributes.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.attributes.price)}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                      <span>Loading items</span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Add new items to get started
                    </p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1E1E40] flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? "Edit Item" : "Add New Item"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Item/Service Name*
                  </label>
                  <input
                    id="name"
                    type="text"
                    ref={nameRef}
                    defaultValue={editItem?.attributes.name || ""}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter name"
                    autoFocus
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price*
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    ref={priceRef}
                    defaultValue={editItem?.attributes.price || ""}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter price"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="min-w-24"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="min-w-24"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isEditMode ? "Updating" : "Adding"}</span>
                      </div>
                    ) : isEditMode ? (
                      "Update Item"
                    ) : (
                      "Add Item"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCharges;
