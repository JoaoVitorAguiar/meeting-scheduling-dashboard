// components/EventsPage.tsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarHeader from "@/components/CalendarHeader";
import DayCell from "@/components/DayCell";
import DailyMeetingList from "@/components/MeetingList";
import { NewMeetingDialog } from "@/components/NewMeetingDialog";
import Sidebar from "@/components/Sidebar"; 
import { enUS } from 'date-fns/locale'; 
import { FiCalendar } from "react-icons/fi";
import { setupAPIClient } from "@/services/api";

interface EventsPageProps {
  apiEndpoint: string;  // Endpoint dinâmico a ser passado
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  createdBy: string;
  attendees: string[];
}

interface NewMeeting {
  title: string;
  description?: string;
  date: string;
  attendees: string[];
}

export default function EventsPage({ apiEndpoint }: EventsPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = setupAPIClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [meetingsResponse, usersResponse] = await Promise.all([
          api.get(apiEndpoint),  // Faz a chamada ao endpoint dinâmico
          api.get("/users"),
        ]);

        setMeetings(meetingsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);  

  const weekStart = startOfWeek(selectedDate, { locale: enUS });
  const weekEnd = endOfWeek(selectedDate, { locale: enUS, weekStartsOn: 0 });
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
    const now = new Date();
    const meetingDate = new Date(newMeeting.date);
    
    if (isAfter(now, meetingDate)) {
      alert("Este horário/dia já passou. Escolha uma data e hora futura.");
      return;
    }
    
    const meeting: Meeting = {
      id: generateId(),
      createdBy: "currentUserId",
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
    <div className="flex h-screen bg-blue-50">
      <Sidebar onCreateMeeting={() => setIsNewMeetingOpen(true)} />
      <div className="flex-1 p-1 max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading...</div>
        ) : (
          <>
            <Card className="mb-1 shadow-md bg-white rounded-lg">
              <CardHeader className="text-2xl font-bold text-center">
                <CardTitle className="text-2xl font-bold text-center text-gray-400 flex items-center justify-center">
                  <FiCalendar className="mr-1" />
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
                <div className="grid grid-cols-7 gap-0">
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
            <DailyMeetingList
              meetings={filteredMeetings}
              users={users}
              selectedDate={selectedDate}
            />
            <NewMeetingDialog
              isOpen={isNewMeetingOpen}
              onClose={() => setIsNewMeetingOpen(false)}
              onMeetingCreated={handleMeetingCreated}
              users={users}
            />
          </>
        )}
      </div>
    </div>
  );
}
