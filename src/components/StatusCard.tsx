interface StatusCardProps {
  count: number;
  label: string;
  className?: string;
  type: "os" | "page" | "training";
  status: string;
  onClick: (type: string, status: string) => void;
}
export default function StatusCard({
  count,
  label,
  className = "",
  type,
  status,
  onClick,
}: StatusCardProps) {
  const handleClick = () => {
    // Em vez de usar Router, chamamos a função recebida por props
    onClick(type, status);
  };

  return (
    <div
      className={`${className} transition-transform hover:scale-105 cursor-pointer rounded shadow p-4`}
      onClick={handleClick}
    >
      <div className="text-4xl font-bold mb-2">{count}</div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}
