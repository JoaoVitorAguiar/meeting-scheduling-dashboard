"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { setupAPIClient } from "@/services/api";

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

interface NewMeeting {
  id?: string; // Adicionado para incluir o ID
  title: string;
  description: string;
  date: string;
  attendees: string[]; // Certifique-se de que isso seja consistente
}

interface NewMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated: (newMeeting: NewMeeting) => void; // Aceita um Meeting como argumento
}

export function NewMeetingDialog({
  isOpen,
  onClose,
  onMeetingCreated,
}: NewMeetingDialogProps) {
  const [newMeeting, setNewMeeting] = useState<NewMeeting>({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    attendees: [],
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = setupAPIClient();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/users");
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const nowUtc = new Date();
    const utcString = new Date(
      nowUtc.getTime() - nowUtc.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setNewMeeting((prev) => ({ ...prev, date: utcString }));
  }, []);

  const handleNewMeeting = async () => {
    setIsLoading(true);
    try {
      const utcDate = new Date(newMeeting.date).toISOString();
      const response = await api.post("/meeting", {
        title: newMeeting.title,
        description: newMeeting.description,
        date: utcDate,
        attendees: newMeeting.attendees,
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Meeting created successfully.",
        });
        onMeetingCreated({
          id: response.data.id, // Adicione isso se a API retornar o ID
          title: newMeeting.title,
          description: newMeeting.description,
          date: utcDate,
          attendees: newMeeting.attendees,
        });
        onClose();
        setNewMeeting({
          title: "",
          description: "",
          date: new Date().toISOString().slice(0, 16),
          attendees: [],
        });
      } else {
        throw new Error("Failed to create meeting");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to create meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Meeting</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newMeeting.title}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, title: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={newMeeting.description}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="datetime-local"
              value={newMeeting.date}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, date: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Attendees</Label>
            <div className="col-span-3 space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={newMeeting.attendees.includes(user.email)}
                    onCheckedChange={(checked) => {
                      const attendees = checked
                        ? [...newMeeting.attendees, user.email]
                        : newMeeting.attendees.filter(
                            (email) => email !== user.email
                          );
                      setNewMeeting({ ...newMeeting, attendees });
                    }}
                  />
                  <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleNewMeeting} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
