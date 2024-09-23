"use client";

import { useEffect, useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  parseISO,
  addDays,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarHeader from "@/components/CalendarHeader";
import DayCell from "@/components/DayCell";
import DailyMeetingList from "@/components/MeetingList";
import { NewMeetingDialog } from "@/components/NewMeetingDialog";
import { setupAPIClient } from "@/services/api";

// Interfaces
interface User {
  id: string;
  email: string;
  name: string;
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  createdBy: string;
  attendees: string[];
}

interface NewMeeting {
  title: string;
  description?: string;
  date: string; // ISO string
  attendees: string[]; // Certifique-se de que isso esteja presente
}

export default function AdvancedCalendar() {
  const initialDate =
    typeof window !== "undefined" ? new Date() : new Date(Date.now());
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const api = setupAPIClient();

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get("/meeting");
        const currentDate = new Date();

        // Filtra reuniões que não estão expiradas
        const upcomingMeetings = response.data.filter((meeting: Meeting) =>
          isAfter(parseISO(meeting.date), currentDate)
        );

        setMeetings(upcomingMeetings);
      } catch (error) {
        console.error("Erro ao buscar reuniões:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchMeetings();
    fetchUsers();
  }, [api]);

  const handlePreviousWeek = () => {
    setSelectedDate((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => addDays(prev, 7));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day); // Atualiza a data selecionada ao clicar no dia
  };

  const handleMeetingCreated = (newMeeting: NewMeeting) => {
    const meeting: Meeting = {
      id: generateId(), // Função para gerar um ID único
      createdBy: "currentUserId", // Substitua pelo ID do usuário atual
      ...newMeeting, // Espalha as propriedades do NewMeeting
    };
    setMeetings((prev) => [...prev, meeting]);
  };

  // Função para gerar ID (exemplo simples)
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Filtra reuniões para a data selecionada
  const filteredMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.date), selectedDate)
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Meeting Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarHeader
            weekStart={weekStart}
            weekEnd={weekEnd}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onSelectDate={(date) => setSelectedDate(date)} // Atualiza a data ao selecionar
          />
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <DayCell
                key={day.toISOString()}
                day={day}
                isSelected={isSameDay(day, selectedDate)}
                onClick={handleDayClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Passa as reuniões filtradas para o DailyMeetingList */}
      <DailyMeetingList meetings={filteredMeetings} users={users} />

      <Button onClick={() => setIsNewMeetingOpen(true)}>New Meeting</Button>
      <NewMeetingDialog
        isOpen={isNewMeetingOpen}
        onClose={() => setIsNewMeetingOpen(false)}
        onMeetingCreated={handleMeetingCreated} // Passa a função atualizada
      />
    </div>
  );
}
