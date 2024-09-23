"use client";

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
  users: User[]; // Recebendo usuários como props
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

  const handleNewMeeting = async () => {
    // Aqui você pode fazer a lógica de criação da nova reunião, similar ao exemplo anterior
    onMeetingCreated(newMeeting);
    onClose();
    resetForm();
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
          <Button onClick={handleNewMeeting}>Create Meeting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
