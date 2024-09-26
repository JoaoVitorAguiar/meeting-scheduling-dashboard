// src/components/Sidebar.tsx

import Link from 'next/link';
import LogoutButton from "@/components/LogoutButton";
import CreateMeetingButton from "@/components/CreateMeetingButton"; // Importando o botão

import { FiUser, FiSearch, FiMail } from "react-icons/fi";
import { BiCalendarEvent } from "react-icons/bi";
interface SidebarProps {
    onCreateMeeting: () => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateMeeting }) => {
  return (
    <div className="w-64 h-full bg-gray-100 p-6 flex flex-col justify-between shadow-lg">
      <div>
      <div className=" flex flex-col justify-between ">
      <CreateMeetingButton onClick={onCreateMeeting} />
      </div>
      <nav className="space-y-6 mt-10">
        {/* Link para o Perfil */}
        <Link href="/profile" className="flex items-center text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
          <FiUser className="mr-3 text-blue-500" size={24} /> {/* Ícone de perfil */}
          <span className="font-poppins">My Profile</span>
        </Link>

        {/* Link para Meus Eventos */}
        <Link href="/my-events" className="flex items-center text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
          <BiCalendarEvent className="mr-3 text-blue-500" size={24} />
          <span className="font-poppins">My Events</span>
        </Link>

        {/* Link para Eventos Convidados */}
        <Link href="/invited-events" className="flex items-center text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
          <FiMail className="mr-3 text-blue-500" size={24} />
          <span className="font-poppins">Invited Events</span>
        </Link>

        {/* Link para Lista de Usuários */}
        <Link href="/users" className="flex items-center text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
          <FiSearch className="mr-3 text-blue-500" size={24} /> {/* Ícone de lupa */}
          <span className="font-poppins">Users</span>
        </Link>
      </nav>
      </div>
      <LogoutButton />
    </div>
  );
};


export default Sidebar;
