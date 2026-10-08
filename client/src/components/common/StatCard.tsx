import { Link } from "react-router-dom";
import { PiArrowUpRight } from "react-icons/pi";

interface Props {
  title: string;
  value: number;
  to: string;
}

const StatCard = ({ title, value, to }: Props) => (
  <Link
    to={to}
    className="group flex flex-col justify-between gap-8 border border-line bg-surface p-6 transition-colors hover:border-muted"
  >
    <div className="flex items-center justify-between text-sm text-muted">
      <span>{title}</span>
      <PiArrowUpRight
        className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </div>
    <p className="font-display text-6xl font-medium leading-none text-fg">{value}</p>
  </Link>
);

export default StatCard;
