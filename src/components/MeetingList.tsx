"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
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

interface DailyMeetingListProps {
  meetings: Meeting[];
  users: User[];
  selectedDate: Date;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function DailyMeetingList({
  meetings = [],
  users = [],
  selectedDate,
}: DailyMeetingListProps) {

  // Mantemos todos os meetings, sem qualquer filtro por data
  const dayMeetings = meetings;

  return (
    <Card className="w-full max-w-full mx-auto mt-4 bg-blue-50 shadow-lg rounded-lg">
      <CardContent className="p-4">
        <ScrollArea className="h-[500px] w-full overflow-y-auto pr-2">
          {HOURS.map((hour) => {
            const hourMeetings = dayMeetings.filter((meeting) => {
              const meetingDate = parseISO(meeting.date);
              return meetingDate.getHours() === hour;
            });

            return (
              <div key={hour} className="mb-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {format(new Date(selectedDate.setHours(hour, 0)), "h:mm a")}
                </div>
                {hourMeetings.length > 0 ? (
                  hourMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="shadow-md rounded-lg p-3 mb-2 hover:shadow-lg transition-shadow duration-200 bg-white"
                    >
                      <h4 className="font-medium">{meeting.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {format(parseISO(meeting.date), "h:mm a")}
                      </span>
                      {meeting.description && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          {meeting.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {meeting.attendees.map((attendeeId) => {
                          const attendee = users.find((user) => user.id === attendeeId);
                          return attendee ? (
                            <Badge key={attendee.id} variant="secondary">
                              {attendee.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-100 rounded-lg p-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      Nenhum evento para este horário.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
