interface Props {
  title: string;
  value: number;
}

const StatCard = ({ title, value }: Props) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500 ease-out z-0 opacity-50"></div>
      <p className="text-slate-500 text-sm font-medium z-10 relative">{title}</p>
      <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight z-10 relative">{value}</h2>
    </div>
  );
};

export default StatCard;