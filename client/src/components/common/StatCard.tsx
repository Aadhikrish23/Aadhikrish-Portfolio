interface Props {
  title: string;
  value: number;
}

const StatCard = ({ title, value }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-black">{value}</h2>
    </div>
  );
};

export default StatCard;