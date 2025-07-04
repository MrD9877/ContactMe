import { toast } from "sonner";

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback: create a temporary textarea
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // prevent scroll
  textarea.style.top = "-1000px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
  } catch {
    toast("Fallback copy failed");
  }

  document.body.removeChild(textarea);
};
