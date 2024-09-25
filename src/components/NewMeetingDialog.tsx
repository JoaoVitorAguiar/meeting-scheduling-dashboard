"use client";
import Cookies from "js-cookie";
import { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface NewMeeting {
  title: string;
  description?: string;
  date: string;
  attendees: string[];
}

interface NewMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated: (newMeeting: NewMeeting) => void;
  users: User[];
}

export function NewMeetingDialog({
  isOpen,
  onClose,
  onMeetingCreated,
  users,
}: NewMeetingDialogProps) {
  const [newMeeting, setNewMeeting] = useState<NewMeeting>({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    attendees: [],
  });

  const [error, setError] = useState<string>("");

  const handleNewMeeting = async () => {
    setError(""); // Limpa qualquer erro anterior
  
    const cookieToken = Cookies.get("meeting-scheduling");
    const now = new Date(); // Data e hora atuais
    const meetingDate = new Date(newMeeting.date); // Data/hora do evento
  
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!newMeeting.title || !newMeeting.date || newMeeting.attendees.length === 0) {
      setError("Please fill in all fields");
      return;
    }
  
    // Verifica se a data/hora do evento é anterior à data/hora atual
    if (meetingDate <= now) {
      setError("Cannot create a meeting in the past. Please select a future date and time.");
      return;
    }
  
    try {
      // Faz a requisição POST para o backend
      const response = await axios.post(
        "http://localhost:3333/meeting",
        {
          title: newMeeting.title,
          date: newMeeting.date,
          emails: newMeeting.attendees,
          description: newMeeting.description,
        },
        {
          headers: {
            Authorization: `Bearer ${cookieToken}`,
          },
        }
      );
      
      console.log(response.data);
  
      // Atualiza o estado de reuniões e fecha o diálogo
      onMeetingCreated(newMeeting);
      onClose();
      resetForm();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to create meeting.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  

  const resetForm = () => {
    setNewMeeting({
      title: "",
      description: "",
      date: new Date().toISOString().slice(0, 16),
      attendees: [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create New Meeting</DialogTitle>
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button onClick={handleNewMeeting}>Create Meeting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
