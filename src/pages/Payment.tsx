import Fpayment from "../components/Finance/payment/Fpayment";
import PaymentPage from "../components/Superadmin/payment/PaymentPage";
import { useRole } from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import { JSX } from "react";
const roleComponents: Record<string, JSX.Element> = {
  admin: <PaymentPage />,
  finance: <Fpayment />,
};

const Payment = () => {
  const navigate = useNavigate();
  const role = useRole();

  // Default to 'Unauthorized' if role is not recognized
  return role ? roleComponents[role] : (navigate("/signin"), null);
};

export default Payment;
