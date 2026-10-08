import { PiSpinnerGap } from "react-icons/pi";

// Shared admin building blocks. They use the same tokens as the public site (the admin
// layout carries the `site` class), so the two halves of the product read as one.

export const fieldClass =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-fg placeholder:text-subtle transition-colors hover:border-muted/60 focus:border-muted disabled:opacity-60";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="min-w-0">
        <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-fg md:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-prose text-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent/85",
  secondary: "border border-muted/60 text-fg hover:bg-fg hover:text-canvas",
  danger: "border border-red-400/60 text-red-200 hover:bg-red-500/15",
  ghost: "text-muted hover:bg-surface hover:text-fg",
};

export function Button({
  variant = "secondary",
  loading = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
      {...rest}
    >
      {loading && <PiSpinnerGap className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  className = "",
  children,
  type = "button",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-surface hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-fg">
        {label}
        {hint && <span className="ml-2 font-normal text-subtle">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-4 border p-4 text-left transition-colors ${
        checked ? "border-accent/70 bg-accent/10" : "border-line hover:border-muted/60"
      }`}
    >
      <span>
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 transition-colors ${checked ? "bg-accent" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 bg-fg transition-all ${checked ? "left-[1.375rem]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-xs ${
        tone === "accent" ? "border-accent/70 bg-accent/15 text-accent-text" : "border-line text-muted"
      }`}
    >
      {children}
    </span>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line px-6 py-14 text-center">
      <p className="font-display text-2xl text-fg">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-md text-muted">{body}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function Loading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-20 animate-pulse border border-line bg-surface" />
      ))}
    </div>
  );
}
