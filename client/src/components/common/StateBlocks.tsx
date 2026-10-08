import { Link } from "react-router-dom";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-surface ${className}`} />;
}

interface MessageProps {
  title: string;
  body?: string;
  action?: { label: string; to: string };
}

export function EmptyState({ title, body, action }: MessageProps) {
  return (
    <div className="border border-dashed border-line px-6 py-14">
      <p className="font-display text-2xl text-fg">{title}</p>
      {body && <p className="mt-2 text-muted">{body}</p>}
      {action && (
        <Link
          to={action.to}
          className="mt-6 inline-block font-medium text-fg underline decoration-accent decoration-2"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this right now." }: { title?: string }) {
  return (
    <div className="border border-line bg-surface px-6 py-12">
      <p className="font-display text-2xl text-fg">{title}</p>
      <p className="mt-2 text-muted">The server may still be starting up.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 border border-muted px-5 py-2.5 font-medium text-fg transition-colors hover:bg-fg hover:text-canvas active:translate-y-px"
      >
        Try again
      </button>
    </div>
  );
}
