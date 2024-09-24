// src/components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove o cookie do token
    Cookies.remove("meeting-scheduling");

    // Redireciona para a página de login
    router.push("/Login");
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Log-out
    </Button>
  );
}
