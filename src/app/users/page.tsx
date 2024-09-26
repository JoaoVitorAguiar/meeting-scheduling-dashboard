"use client";

import { useEffect, useState } from "react";
import { setupAPIClient } from "@/services/api";
import Sidebar from "@/components/Sidebar"; // Importando a Sidebar
import { FiSearch } from "react-icons/fi"; // Ícone de pesquisa para um visual moderno
import { Card, CardContent } from "@/components/ui/card"; // Para um estilo mais elegante na listagem de usuários
import { NewMeetingDialog } from "@/components/NewMeetingDialog"; // Importando o diálogo de nova reunião

interface User {
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false); // Controle do diálogo de nova reunião
  const api = setupAPIClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  // Função chamada quando a reunião é criada
  const handleMeetingCreated = (newMeeting: NewMeeting) => {
    const meeting: Meeting = {
      id: generateId(),
      createdBy: "currentUserId", // Use o ID do usuário atual aqui
      ...newMeeting,
    };
    console.log("Novo evento criado:", meeting);
    // Aqui você pode enviar o novo evento para o backend
  };

  // Gerar um ID aleatório para a reunião
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar com botão de criar reunião */}
      <Sidebar onCreateMeeting={() => setIsNewMeetingOpen(true)} /> {/* Abre o diálogo ao clicar no botão */}

      {/* Conteúdo principal */}
      <div className="flex-1 p-8">
        <h2 className="mb-6 text-3xl font-bold text-gray-400">Users</h2>

        {/* Campo de pesquisa estilizado */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>

        {/* Listagem de usuários */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-gray-800">{user.name}</h4>
                <p className="text-gray-500">{user.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exibição de nenhum usuário encontrado */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-6">
            <p>No users found for the search term.</p>
          </div>
        )}
      </div>

      {/* Diálogo para criar novo evento */}
      <NewMeetingDialog
        isOpen={isNewMeetingOpen}
        onClose={() => setIsNewMeetingOpen(false)}
        onMeetingCreated={handleMeetingCreated}
        users={users} // Passando a lista de usuários como participantes potenciais
      />
    </div>
  );
}
