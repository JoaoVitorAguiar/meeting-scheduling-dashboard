import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CalendarHeaderProps {
  weekStart: Date;
  weekEnd: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onSelectDate: (date: Date) => void; // Nova prop para seleção de data
}

export default function CalendarHeader({
  weekStart,
  weekEnd,
  onPreviousWeek,
  onNextWeek,
  onSelectDate,
}: CalendarHeaderProps) {
  const handleDayClick = (day: Date) => {
    onSelectDate(day); // Chama a função ao clicar em um dia
  };

  const daysInWeek = [];
 for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    daysInWeek.push(new Date(d)); // Adiciona cada dia à lista
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="outline" size="icon" onClick={onPreviousWeek}>
        <FiChevronLeft />
      </Button>
      <h2 className="text-lg font-semibold">
        {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
      </h2>
      <Button variant="outline" size="icon" onClick={onNextWeek}>
        <FiChevronRight />
      </Button>
     
    </div>
  );
}
