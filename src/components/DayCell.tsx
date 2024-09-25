import { format, isToday } from "date-fns";

interface DayCellProps {
  day: Date;
  isSelected: boolean;
  onClick: (day: Date) => void;
}

export default function DayCell({ day, isSelected, onClick }: DayCellProps) {
  const isCurrentDay = isToday(day); // Verifica se é o dia atual

  return (
    <div className="text-center cursor-pointer" onClick={() => onClick(day)}>
      <div className="font-semibold mb-2">{format(day, "EEE")}</div>
      <div
        className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
          isSelected ? "border-2 border-blue-500" : ""
        } ${isCurrentDay ? "bg-green-500 text-white" : ""}`} // Destaca o dia atual
      >
        {format(day, "d")}
      </div>
    </div>
  );
}

