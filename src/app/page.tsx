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
import { format } from "date-fns";

import LogoutButton from "@/components/LogoutButton";

import { enUS } from 'date-fns/locale'; 

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
  attendees: string[];
}

export default function AdvancedCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para controlar requisições
  const api = setupAPIClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [meetingsResponse, usersResponse] = await Promise.all([
          api.get("/meeting"),
          api.get("/users"),
        ]);

        const currentDate = new Date();
        const upcomingMeetings = meetingsResponse.data.filter(
          (meeting: Meeting) => isAfter(parseISO(meeting.date), currentDate)
        );
        setMeetings(upcomingMeetings);
        setUsers(usersResponse.data); // Armazena usuários
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Removido 'api' das dependências


  const weekStart = startOfWeek(selectedDate, { locale: enUS });

  const weekEnd = endOfWeek(selectedDate, { locale: enUS, weekStartsOn: 0 }); // 0 para domingo ou 1 para segunda-feira






  
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePreviousWeek = () => {
    setSelectedDate((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => addDays(prev, 7));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleMeetingCreated = (newMeeting: NewMeeting) => {
    const meeting: Meeting = {
      id: generateId(),
      createdBy: "currentUserId", // Substitua pelo ID do usuário atual
      ...newMeeting,
    };
    setMeetings((prev) => [...prev, meeting]);
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const filteredMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.date), selectedDate)
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <LogoutButton />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Meeting Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarHeader
                weekStart={weekStart}
                weekEnd={weekEnd}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onSelectDate={(date) => setSelectedDate(date)}
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

          <DailyMeetingList meetings={filteredMeetings} users={users} selectedDate={selectedDate} />

          <Button onClick={() => setIsNewMeetingOpen(true)}>New Meeting</Button>
          <NewMeetingDialog
            isOpen={isNewMeetingOpen}
            onClose={() => setIsNewMeetingOpen(false)}
            onMeetingCreated={handleMeetingCreated}
            users={users} 
          />
        </>
      )}
    </div>
  );
}




