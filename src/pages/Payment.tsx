import Fpayment from "../components/Finance/payment/Fpayment";
import PaymentPage from "../components/Superadmin/payment/PaymentPage";
import { useRole } from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import { JSX, useEffect } from "react";
const roleComponents: Record<string, JSX.Element> = {
  admin: <PaymentPage />,
  finance: <Fpayment />,
  "front-desk-manager": <Fpayment />,
};

const Payment = () => {
  const navigate = useNavigate();
  const role = useRole();

  useEffect(() => {
    if (!role) {
      navigate("/signin");
    }
  }, [role, navigate]);

  return role ? roleComponents[role] || null : null;
};

export default Payment;
