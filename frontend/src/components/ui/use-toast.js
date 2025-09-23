"use client";
import { toast } from "sonner";

export const useToast = () => {
  const showToast = ({ title, description, variant = "default" }) => {
    const message = description || title;

    switch (variant) {
      case "destructive":
        return toast.error(message);
      case "success":
        return toast.success(message);
      default:
        return toast(message);
    }
  };

  return { toast: showToast };
};
