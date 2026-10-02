import Swal from "sweetalert2";

// ── Base config matching the orange Campus Guide design system ──────────────
const base = Swal.mixin({
  customClass: {
    popup:          "!rounded-2xl !shadow-2xl !border !border-gray-100 !font-sans",
    title:          "!text-base !font-bold !text-gray-900",
    htmlContainer:  "!text-xs !text-gray-500",
    confirmButton:  "!rounded-xl !text-xs !font-semibold !px-5 !py-2.5 !bg-orange-500 !text-white hover:!bg-orange-600 !shadow-sm !shadow-orange-200",
    cancelButton:   "!rounded-xl !text-xs !font-semibold !px-5 !py-2.5 !bg-white !text-gray-600 !border !border-gray-200 hover:!bg-gray-50",
    denyButton:     "!rounded-xl !text-xs !font-semibold !px-5 !py-2.5 !bg-red-500 !text-white hover:!bg-red-600",
  },
  buttonsStyling: false,
  reverseButtons: true,
});

// ── Toast (top-right, auto-close) ───────────────────────────────────────────
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "!rounded-xl !shadow-lg !border !border-gray-100 !font-sans !text-xs",
  },
});

// ── Public helpers ───────────────────────────────────────────────────────────

/** Green success toast */
export const swToast = (message: string) =>
  Toast.fire({ icon: "success", title: message });

/** Red error toast */
export const swErrorToast = (message: string) =>
  Toast.fire({ icon: "error", title: message });

/** Full-screen success modal */
export const swSuccess = (title: string, text?: string) =>
  base.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "OK",
  });

/** Full-screen error modal */
export const swError = (title: string, text?: string) =>
  base.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

/** Delete / destructive confirm dialog — returns true if user confirmed */
export const swConfirmDelete = async (
  title = "Are you sure?",
  text  = "This action cannot be undone."
): Promise<boolean> => {
  const result = await base.fire({
    icon: "warning",
    title,
    text,
    showCancelButton:  true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText:  "Cancel",
    customClass: {
      popup:         "!rounded-2xl !shadow-2xl !border !border-gray-100 !font-sans",
      title:         "!text-base !font-bold !text-gray-900",
      htmlContainer: "!text-xs !text-gray-500",
      confirmButton: "!rounded-xl !text-xs !font-semibold !px-5 !py-2.5 !bg-red-500 !text-white hover:!bg-red-600",
      cancelButton:  "!rounded-xl !text-xs !font-semibold !px-5 !py-2.5 !bg-white !text-gray-600 !border !border-gray-200 hover:!bg-gray-50",
    },
    buttonsStyling: false,
    reverseButtons: true,
  });
  return result.isConfirmed;
};

/** Generic confirm dialog — returns true if user confirmed */
export const swConfirm = async (
  title: string,
  text?: string,
  confirmText = "Confirm"
): Promise<boolean> => {
  const result = await base.fire({
    icon: "question",
    title,
    text,
    showCancelButton:  true,
    confirmButtonText: confirmText,
    cancelButtonText:  "Cancel",
  });
  return result.isConfirmed;
};
