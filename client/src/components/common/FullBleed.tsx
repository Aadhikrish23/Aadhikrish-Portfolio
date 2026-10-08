// Breaks out of the centered page column so a color field spans the whole viewport.
export default function FullBleed({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative left-1/2 w-screen -translate-x-1/2 ${className}`}>{children}</div>
  );
}
