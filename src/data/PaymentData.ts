export interface Payment {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  date: string;
  status: "All" | "Full Payment" | "Half Payment";
}

export const paymentData: Payment[] = [
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Full Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Full Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Full Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Surgery",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Full Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Half Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Half Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Full Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Full Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Half Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Half Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Half Payment",
  },
  {
    id: "HP-22345",
    patient: "Mary Benson",
    amount: "₦100,000",
    purpose: "Membership card",
    paymentMethod: "Bank Transfer",
    date: "22-02-2025",
    status: "Half Payment",
  },
];
