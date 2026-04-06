
interface Props {
  title: string;
  description: string;
}


export default function InfoCard({title,description}:Props) {
  return (
     <div className="p-6 border border-gray-800 rounded-xl hover:border-gray-600 transition hover:bg-white/5">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  )
}
