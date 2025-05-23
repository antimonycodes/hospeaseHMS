export interface Role {
  id: number;
  role: string;
}

export interface RolesState {
  [key: string]: Role;
}

export interface PaymentItem {
  id: any;
  attributes: {
    amount?: string | number | null;
    name?: string;
    service_item_name?: string;
    service_item_price?: string | number | null;
    isPharmacy?: boolean;
    availableQuantity?: string | number;
  };
  quantity: number;
  total: number;
}

export interface AddPaymentModalProps {
  onClose: () => void;
  endpoint?: string;
  refreshEndpoint?: string;
}

export interface PaymentSourceOption {
  id: string;
  name: string;
}
export interface PaymentItem {
  id: any;
  attributes: {
    amount?: string | number | null;
    name?: string;
    service_item_name?: string;
    service_item_price?: string | number | null;
    isPharmacy?: boolean;
    availableQuantity?: string | number;
  };
  quantity: number;
  total: number;
}
