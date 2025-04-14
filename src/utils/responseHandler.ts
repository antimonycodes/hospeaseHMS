import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const isSuccessfulResponse = (res: any) =>
  res?.success || (res?.status >= 200 && res?.status < 300);

export const handleErrorToast = (
  error: unknown,
  fallbackMessage = "Something went wrong!"
) => {
  const err = error as AxiosError<{ message?: string; error?: string }>;
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallbackMessage;
  toast.error(message);
};
