"use client";

import { useEffect, useState } from "react";
import { setupAPIClient } from "@/services/api";
import Sidebar from "@/components/Sidebar";
import { NewMeetingDialog } from "@/components/NewMeetingDialog";
import { FiUser, FiMail } from "react-icons/fi";

// Interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
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

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]); // Para os participantes do evento
  const api = setupAPIClient();

  // Carregar perfil do usuário
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Erro ao buscar o perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    // Carregar lista de usuários
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchProfile();
    fetchUsers();
  }, []);

  // Lógica para criar um evento
  const handleMeetingCreated = (newMeeting: NewMeeting) => {
    const meeting: Meeting = {
      id: generateId(),
      createdBy: profile?.id || "currentUserId",
      ...newMeeting,
    };
    // Aqui você pode enviar o novo evento para o backend ou atualizar o estado
    console.log("Novo evento criado:", meeting);
  };

  // Gerar ID aleatório
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar onCreateMeeting={() => setIsNewMeetingOpen(true)} /> {/* Botão de criar reunião */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
        {profile ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
  <FiUser className="text-gray-600 mr-2 text-2xl" />  
  <p className="text-xl font-semibold">{profile.name}</p>
</div>
<div className="flex items-center">
  <FiMail className="text-gray-600 mr-2 text-2xl" /> 
  <p className="text-lg">{profile.email}</p>
</div>

          </div>
        ) : (
          <p>No profile data available</p>
        )}

        {/* Dialog para criar novo evento */}
        <NewMeetingDialog
          isOpen={isNewMeetingOpen}
          onClose={() => setIsNewMeetingOpen(false)}
          onMeetingCreated={handleMeetingCreated}
          users={users} // Lista de usuários disponíveis
        />
      </div>
    </div>
  );
}
