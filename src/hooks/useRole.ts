// import { useAuth } from "../store/AuthContext";

import { useAuthStore } from "../store/_auth/useAuthStore";

// import { useAuthStore } from "../store/_auth/useAuthStore";

export const useRole = () => {
  // const { user } = useAuth();
  const { role } = useAuthStore();
  return role || localStorage.getItem("role");
};
