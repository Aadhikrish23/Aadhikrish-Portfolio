import Kerned from "./Kerned";

interface Props {
  title: string;
  className?: string;
}

export default function SectionTitle({ title, className = "" }: Props) {
  return (
    <h2
      className={`font-display text-5xl font-medium leading-[1.02] tracking-tight text-fg md:text-7xl ${className}`}
    >
      <Kerned text={title} />
    </h2>
  );
}
