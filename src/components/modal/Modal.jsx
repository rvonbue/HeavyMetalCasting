// components/ui/Modal.jsx
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-lg",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className={`w-full ${maxWidth} rounded-xl bg-hmc-panelbackground shadow-xl border border-hmc-border-b`}>
        <div className="flex items-center justify-between border-b border-hmc-border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-hmc-textprimary">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-hmc-textprimary/60 hover:bg-hmc-border-b hover:text-hmc-textprimary transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}