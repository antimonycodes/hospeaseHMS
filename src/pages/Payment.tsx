import Fpayment from "../components/Finance/payment/Fpayment";
import PaymentPage from "../components/Superadmin/payment/PaymentPage";
import { useRole } from "../hooks/useRole";
import { JSX } from "react";
const roleComponents: Record<string, JSX.Element> = {
  admin: <PaymentPage />,
  finance: <Fpayment />,
};

const Payment = () => {
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : <p>Unauthorized Access</p>;
};

export default Payment;
