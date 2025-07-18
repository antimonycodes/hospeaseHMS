import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("hhmstxt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface Stock {
  id: number;
  attributes: {
    item_name: string;
    category: string;
    quantity: string;
    expiry_date: string;
    cost: number;
    image?: string;
  };
}

export interface Category {
  id: number;
  attributes: {
    name: string;
  };
}

export interface Staff {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    card_id: string;
  };
}

export interface Request {
  id: number;
  requested_by: string;
  inventory_id: string;
  quantity: string;
  status: string;
  first_name: string;
  last_name: string;
  user_id: string;
  item_category: string;
  item_name: string;
  created_at: string;
}
// export interface CreateStockData {
//   service_item_name?: string;
//   item?: string; // Support legacy naming
//   quantity: number;
//   category_id: number;
//   expiry_date: string;
//   service_item_price?: number | string;
//   cost: number;
//   service_charge_id?: number | string; // Added service charge ID
//   image?: File | null;
// }

// export interface CreateStockData {
//   any: any;
// }

export interface InventoryStats {
  data: InventoryStats;
  total_inventories: number;
  total_categories: number;
  total_expired_items: number;
  graph_appointment_representation?: Record<string, number>;
}

interface InventoryStore {
  isLoading: boolean;
  stats: InventoryStats | null;
  categorys: any[];
  pagination: Pagination | null;
  stocks: any[];
  requests: any[];
  stockActivities: any[];
  restockHistoryData: any[];
  allPharRequest: any[];
  // requests: { data: any[]; pagination: Pagination }[];
  getInventoryStats: (endpoint?: string) => Promise<void>;
  getAllStocks: (
    endpoint?: string,
    per_page?: string,
    page?: string
  ) => Promise<void>;
  getAllStocksSa: (
    endpoint?: string,
    per_page?: string,
    page?: string
  ) => Promise<void>;
  createStock: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean | null>;

  updateStock: (
    id: any,
    editableData: any,
    // currentStockData: any,
    endpoint?: any
  ) => Promise<any>;
  deleteStock: (id: number, fetchEndpoint?: string) => Promise<boolean>;
  searchStaff: (query: string) => Promise<Staff[]>;
  getAllRequest: (endpoint?: string) => Promise<void>;
  getAllCategorys: (fetchEndpoint: string) => Promise<void>;
  createRequest: (
    data: any,
    endpoint?: string,
    refreshEndpoint?: string
  ) => Promise<boolean>;
  createCategory: (
    data: { name: string },
    Catendpoint?: string,
    createEndpoint?: string
  ) => Promise<boolean>;
  updateCategory: (
    id: number,
    data: { name: string }
  ) => Promise<boolean | null>;
  reStockHistory: (id: number) => Promise<any>;
  reStock: (data: any) => Promise<any>;
  updateSaCategory: (
    id: number,
    data: { name: string }
  ) => Promise<boolean | null>;
  deleteCategory: (id: number, fetchEndpoint?: string) => Promise<boolean>;
  requestToInventory: (data: any) => Promise<any>;
  allPharmacyRequest: () => Promise<any>;
  changePharmacyRequestStatus: (id: number, data: any) => Promise<any>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  stats: null,
  isLoading: false,
  pagination: null,
  stocks: [],
  requests: [],
  categorys: [],
  stockActivities: [],
  restockHistoryData: [],
  allPharRequest: [],

  searchStaff: async (query: string) => {
    try {
      const response = await api.get(
        `/medical-report/all-staffs?search=${query}`
      );
      console.log("Staff search response:", response.data);
      const staffData = response.data.data;
      return staffData;
    } catch (error: any) {
      console.error("Staff search error:", error.response?.data);
      toast.error(error.response?.data?.message || "Staff search failed");
      return [];
    }
  },

  getAllRequest: async (
    endpoint = "/inventory/requests/all-records",
    page = "1",
    perPage = "1000"
  ) => {
    set({ isLoading: true });
    try {
      const separator = endpoint.includes("?") ? "&" : "?";
      const fullEndpoint = endpoint.includes("page=")
        ? endpoint
        : `${endpoint}${separator}page=${page}&per_page=${perPage}`;

      const response = await api.get(fullEndpoint);

      if (response.data && response.data.data) {
        set({ requests: response.data.data });
        // toast.success(response.data.message || "Requests fetched successfully");
      } else {
        console.error("Unexpected API response structure:", response.data);
        set({
          requests: [
            {
              data: [],
              pagination: {
                total: 0,
                per_page: 0,
                current_page: 0,
                last_page: 0,
                from: 0,
                to: 0,
              },
            },
          ],
        });
      }
    } catch (error: any) {
      console.error("getAllRequest error:", error.response?.data);
      set({
        requests: [
          {
            data: [],
            pagination: {
              total: 0,
              per_page: 0,
              current_page: 0,
              last_page: 0,
              from: 0,
              to: 0,
            },
          },
        ],
      });
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      set({ isLoading: false });
    }
  },

  createRequest: async (
    data,
    endpoint = "/inventory/requests/create",
    refreshEndpoint = "/inventory/requests/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(endpoint, data);
      console.log("createRequest response:", response.data);
      if (response.status === 201 || response.status === 200) {
        await get().getAllRequest(refreshEndpoint);
        toast.success(response.data.message || "Request created successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("createRequest error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create request");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCategorys: async (
    fetchEndpoint = "/inventory/category/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.get(fetchEndpoint);
      const fetchedCategorys = response.data.data;
      set({ categorys: fetchedCategorys });
      console.log(response.data.message);
      // toast.success("Categories fetched successfully");
    } catch (error: any) {
      console.error("getCategories error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      set({ isLoading: false });
    }
  },
  createCategory: async (
    data: { name: string },
    fetchEndpoint = "/inventory/category/all-records",
    createEndpoint = "/inventory/category/create"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post(createEndpoint, data);
      console.log("createCategory response:", response.data);
      if (response.status === 201) {
        await get().getAllCategorys(fetchEndpoint);
        toast.success(response.data.message || "Category created successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("createCategory error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create Category");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Updated getAllStocks method in your inventory store
  getAllStocks: async (
    page = "1",
    perPage = "1000",
    endpoint = "/inventory/all-inventory-items"
  ) => {
    set({ isLoading: true });
    try {
      // Check if endpoint already contains query parameters
      const separator = endpoint.includes("?") ? "&" : "?";
      const fullEndpoint = endpoint.includes("page=")
        ? endpoint
        : `${endpoint}${separator}page=${page}&per_page=${perPage}`;

      const response = await api.get(fullEndpoint);
      set({ stocks: response.data.data?.data || [] });
      // toast.success(response.data.message || "Stocks fetched successfully");
    } catch (error: any) {
      console.error("getAllStocks error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stocks");
    } finally {
      set({ isLoading: false });
    }
  },

  // Optional: Add a dedicated search method for more complex scenarios
  searchStocks: async (filters: {
    search?: string;
    category?: string;
    profit_range?: string;
    stock_status?: string;
    expiry_status?: string;
    from_date?: string;
    to_date?: string;
  }) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams();

      // Add pagination
      queryParams.append("page", "1");
      queryParams.append("per_page", "1000");

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          queryParams.append(key, value.trim());
        }
      });

      const response = await api.get(
        `/inventory/all-inventory-items?${queryParams.toString()}`
      );
      set({ stocks: response.data.data?.data || [] });
    } catch (error: any) {
      console.error("searchStocks error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to search stocks");
    } finally {
      set({ isLoading: false });
    }
  },
  getAllStocksSa: async (
    page = "1",
    perPage = "1000",
    endpoint = "/admin/inventory/all-inventory-items"
  ) => {
    set({ isLoading: true });
    try {
      // Check if endpoint already contains query parameters
      const separator = endpoint.includes("?") ? "&" : "?";
      const fullEndpoint = endpoint.includes("page=")
        ? endpoint
        : `${endpoint}${separator}page=${page}&per_page=${perPage}`;

      const response = await api.get(fullEndpoint);
      set({ stocks: response.data.data?.data || [] });
      // toast.success(response.data.message || "Stocks fetched successfully");
    } catch (error: any) {
      console.error("getAllStocksSa error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stocks");
    } finally {
      set({ isLoading: false });
    }
  },
  searchStocksSa: async (filters: {
    search?: string;
    category?: string;
    profit_range?: string;
    stock_status?: string;
    expiry_status?: string;
    from_date?: string;
    to_date?: string;
  }) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams();

      // Add pagination
      queryParams.append("page", "1");
      queryParams.append("per_page", "1000");

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          queryParams.append(key, value.trim());
        }
      });

      const response = await api.get(
        `/admin/inventory/all-inventory-items?${queryParams.toString()}`
      );
      set({ stocks: response.data.data?.data || [] });
    } catch (error: any) {
      console.error("searchStocks error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to search stocks");
    } finally {
      set({ isLoading: false });
    }
  },

  createStock: async (
    data: any,
    endpoint = "/inventory/upload-item",
    refreshEndpoint = "/admin/inventory/all-inventory-items"
  ) => {
    set({ isLoading: true });
    try {
      const form = new FormData();

      // Append all the required fields
      form.append("service_item_name", data.service_item_name || data.item); // Support both naming conventions
      form.append("quantity", data.quantity.toString());
      form.append("category_id", data.category_id.toString());
      form.append("expiry_date", data.expiry_date);
      form.append(
        "service_item_price",
        data.service_item_price?.toString() || "0"
      ); // Include price with fallback
      form.append("cost", data.cost.toString());
      form.append(
        "service_charge_id",
        data.service_charge_id?.toString() || ""
      );

      // Only append image if it exists
      if (data.image) {
        form.append("image", data.image);
      }

      const response = await api.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success(response.data.message || "Stock added successfully");
        if (refreshEndpoint) {
          await get().getAllStocks();
        } else {
          await get().getAllStocks();
        }
        return true;
      }
      toast.error(response.data.message || "Failed to add stock");
      console.error("Unexpected response status:", response.status);
      return false;
    } catch (error: any) {
      console.error("createStock error:", error);
      const errorMessage = error?.response?.message || "Failed to add stock";

      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessage);
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateStock: async (
    id: number,
    data: { cost: number; quantity: number; expiry_date: any },
    endpoint = "/inventory/update-item"
  ) => {
    set({ isLoading: true });
    try {
      const payload = {
        cost: data.cost,
        quantity: data.quantity,
        // expiry_date: data.expiry_date,
      };

      const response = await api.put(`${endpoint}/${id}`, payload, {
        headers: { "Content-Type": "application/json" }, // Send as JSON
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Stock updated successfully");
        await get().getAllStocks(); // Refresh the stock list
        return true;
      }
      toast.error(response.data.message || "Failed to update stock");
      return false;
    } catch (error: any) {
      console.error("updateStock error:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to update stock";
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteStock: async (
    id: number,
    fetchEndpoint = "/inventory/category/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(
        `/medical-report/inventory/delete/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        await get().getAllStocks();
        toast.success(response.data.message || "Category deleted successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("deleteCategory error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to delete category");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getInventoryStats: async (endpoint = "/inventory/stats") => {
    set({ isLoading: true });
    try {
      const response = await api.get(endpoint);
      const statsData = response.data.data || {
        total_inventories: 0,
        total_categories: 0,
        total_expired_items: 0,
      };
      set({ stats: statsData });
      // toast.success("Inventory stats fetched successfully!");
    } catch (error: any) {
      console.error("Stats fetch error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },
  getStockActivity: async (
    page = "1",
    perPage = "1000",
    endpoint = "/medical-report/stock-activity-logs"
  ) => {
    set({ isLoading: true });
    try {
      // Check if endpoint already contains query parameters
      const separator = endpoint.includes("?") ? "&" : "?";
      const fullEndpoint = endpoint.includes("page=")
        ? endpoint
        : `${endpoint}${separator}page=${page}&per_page=${perPage}`;

      const response = await api.get(fullEndpoint);
      console.log("API Response:", response.data);

      // Make sure we're setting the correct data structure
      set({
        stockActivities: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.log("Error fetching stock activities:", error);
      set({ isLoading: false });
    }
  },
  reStock: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/restock-inventory/create",
        data
      );
      console.log("API Response:", response.data);
      toast.success(response.data.message || "Restock successful");

      // get().getAllStocks("/inventory/all-inventory-items");

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      console.log("Error restocking inventory:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to restock";
      toast.error(errorMessage);
      set({ isLoading: false });
      return false;
    }
  },
  reStockHistory: async (id) => {
    // console.log("Calling reStockHistory for ID:", id);

    // Set loading state once
    set({ isLoading: true });

    try {
      // Make the API call
      const response = await api.get(
        `/medical-report/restock-inventory/all/${id}`
      );

      console.log("✅ API Response:", response.data);

      // Check if the component is still mounted before updating state
      if (response.status === 200) {
        // Update state once with all the data
        set({
          restockHistoryData: response.data.data.data,
          isLoading: false,
        });
        return true;
      }

      set({ isLoading: false });
      return null;
    } catch (error: any) {
      console.log("Error fetching restock history:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch history");

      // Make sure to set loading to false even on error
      set({ isLoading: false });
      return false;
    }
  },
  updateCategory: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/inventory/category/update/${id}`, data);
      if (response.status === 201) {
        toast.success(response.data.message);
        await get().getAllCategorys("/inventory/category/all-records");
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  updateSaCategory: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/admin/inventory/category/update/${id}`,
        data
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        await get().getAllCategorys("/inventory/category/all-records");
        return true;
      }
      console.log(response.data.data?.data);
      toast.success(response.data.message);
      return null;
    } catch (error: any) {
      console.error(
        "Error changing status:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteCategory: async (
    id: number,
    fetchEndpoint = "/inventory/category/all-records"
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(`/inventory/category/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        await get().getAllCategorys(fetchEndpoint);
        toast.success(response.data.message || "Category deleted successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("deleteCategory error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to delete category");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  requestToInventory: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post(
        "/medical-report/restock-inventory/dept-request-restock-item",
        data
      );
      if (response.status === 201) {
        toast.success(response.data.message || "Request sent successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("requestToInventory error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send request");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  allPharmacyRequest: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get(
        "/medical-report/restock-inventory/all-dept-restock-request-item"
      );
      if (response.status === 200) {
        // toast.success(response.data.message || "Request sent successfully");
        set({ allPharRequest: response.data.data.data });
        console.log("allPharmacyRequest", response.data.data.data);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("requestToInventory error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send request");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  changePharmacyRequestStatus: async (id: number, data) => {
    set({ isLoading: true });
    try {
      const response = await api.put(
        `/medical-report/restock-inventory/update-request-restock-status/${id}`,
        data
      );
      if (response.status === 200) {
        // toast.success(response.data.message || "Request status updated");
        get().allPharmacyRequest();
        console.log("allPharmacyRequest", response.data.data.data);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("changePharmacyRequestStatus error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update status");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
