// import { useAuth } from "../store/AuthContext";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/_auth/useAuthStore";

// import { useAuthStore } from "../store/_auth/useAuthStore";

export const useRole = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();

  const { role } = useAuthStore();

  if (!role) return navigate("/signin");
  return role || localStorage.getItem("role");
};
