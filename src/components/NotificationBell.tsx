"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Novo documento disponível",
      description: "Seu relatório mensal está pronto para visualização.",
      date: "2 min atrás",
    },
    {
      id: "2",
      title: "Lembrete de consulta",
      description: "Você tem uma consulta agendada para amanhã às 14:00.",
      date: "1 hora atrás",
    },
    {
      id: "3",
      title: "Fatura disponível",
      description: "Sua fatura do mês de Junho está disponível para pagamento.",
      date: "2 horas atrás",
    },
    {
      id: "4",
      title: "Atualização de sistema",
      description:
        "O sistema será atualizado esta noite. Pode haver uma breve indisponibilidade.",
      date: "1 dia atrás",
    },
    {
      id: "5",
      title: "Novo recurso adicionado",
      description: "Agora você pode exportar seus documentos em formato PDF.",
      date: "3 dias atrás",
    },
  ]);

  const handleNotificationClick = (notificationId: string) => {
    console.log(`Notification ${notificationId} clicked`);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <div className="fixed top-0 right-0 mt-12 mr-4 z-50">
        <DropdownMenuContent align="end" className="w-80 p-0 fixed-menu">
          <ScrollArea className="h-[300px] overflow-y-auto">
            <div className="py-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onSelect={() => handleNotificationClick(notification.id)}
                    className="flex flex-col items-start px-4 py-2 space-y-1 cursor-pointer focus:bg-gray-100 focus:text-gray-900"
                  >
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-gray-500">
                      {notification.description}
                    </div>
                    <div className="text-xs text-gray-400">
                      {notification.date}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-4 py-2 text-center text-gray-500">
                  Não há novas notificações
                </div>
              )}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
