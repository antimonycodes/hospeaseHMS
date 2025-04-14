import { useAuthStore } from "../store/_auth/useAuthStore";

export const useRole = (): string | null => {
  const { role } = useAuthStore();
  return role || (localStorage.getItem("role") as string | null);
};
