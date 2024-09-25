// src/components/CreateMeetingButton.tsx

import { Button } from "@/components/ui/button";

interface CreateMeetingButtonProps {
  onClick: () => void; // Função para abrir o diálogo de nova reunião
}

const CreateMeetingButton: React.FC<CreateMeetingButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="rounded-lg"> 
      New Meeting
    </Button>
  );
};

export default CreateMeetingButton;
