import { useCallback, useMemo, useRef, useState } from "react";
import { PiCheckCircle, PiWarningCircle, PiX } from "react-icons/pi";
import { ToastContext, type ToastTone } from "./toast.context";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = nextId.current++;
      setToasts((all) => [...all.slice(-3), { id, message, tone }]);
      // Errors stay longer: they usually need reading twice
      window.setTimeout(() => dismiss(id), tone === "error" ? 7000 : 3500);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:w-96"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full items-start gap-3 border bg-surface px-4 py-3 text-sm text-fg shadow-lg ${
              toast.tone === "error" ? "border-red-400/60" : "border-line"
            }`}
          >
            {toast.tone === "error" ? (
              <PiWarningCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            ) : (
              <PiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden="true" />
            )}
            <p className="min-w-0 flex-1 break-words">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="shrink-0 text-muted hover:text-fg"
            >
              <PiX className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
