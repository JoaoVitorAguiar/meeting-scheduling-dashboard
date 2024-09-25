import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CalendarHeaderProps {
  weekStart: Date;
  weekEnd: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onSelectDate: (date: Date) => void;
}

export default function CalendarHeader({
  weekStart,
  weekEnd,
  onPreviousWeek,
  onNextWeek,
  onSelectDate,
}: CalendarHeaderProps) {
  const handleDayClick = (day: Date) => {
    onSelectDate(day);
  };

  const daysInWeek = [];
  for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    daysInWeek.push(new Date(d));
  }

  return (
    <div className="flex justify-between items-center mb-1 bg-white shadow-sm p-0 rounded-sm"> {/* Ajuste de padding e margem */}
      <Button variant="outline" size="icon" onClick={onPreviousWeek} className="hover:bg-blue-200 p-1"> {/* Botões menores */}
        <FiChevronLeft size={12} /> {/* Ícones menores */}
      </Button>
      <h2 className="text-m font-medium text-brown-200"> {/* Título com fonte menor */}
        {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
      </h2>
      <Button variant="outline" size="icon" onClick={onNextWeek} className="hover:bg-blue-200 p-0">
        <FiChevronRight size={12} /> {/* Ícone menor */}
      </Button>
    </div>
  );
}
