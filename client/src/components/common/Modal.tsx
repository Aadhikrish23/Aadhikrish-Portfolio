import { useEffect, useId, useRef } from "react";
import { PiX } from "react-icons/pi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "md" | "lg";
}

// Admin dialog. Closes on Escape, the close button, or a click that BOTH starts and ends on the
// backdrop (so dragging a text selection out of a field never dismisses it and loses work).
const Modal = ({ isOpen, onClose, title, children, size = "lg" }: Props) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const pressedOnBackdrop = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        pressedOnBackdrop.current = e.target === e.currentTarget;
      }}
      onMouseUp={(e) => {
        if (pressedOnBackdrop.current && e.target === e.currentTarget) onClose();
        pressedOnBackdrop.current = false;
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex max-h-[92dvh] w-full flex-col border border-line bg-canvas outline-none sm:max-h-[90dvh] ${
          size === "md" ? "sm:max-w-md" : "sm:max-w-3xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id={titleId} className="font-display text-2xl font-medium text-fg">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <PiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
