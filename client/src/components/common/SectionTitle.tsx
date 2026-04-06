interface Props {
  title: String;
}

export default function SectionTitle({title}:Props) {
  return <h2 className="text-3xl md:text-4xl font-semibold mb-12">{title}</h2>;
}
