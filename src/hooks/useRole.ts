import { useAuth } from "../store/AuthContext";

export const useRole = () => {
  const { user } = useAuth();
  return user?.role || localStorage.getItem("role");
};
