"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types/GlobalTypes";
import { NotificationService } from "@/services/NotificationService";
import useAuth from "@/security/UseAuth";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { token } = useAuth();
  const handleNotificationClick = (notificationId: string) => {
    console.log(`Notification ${notificationId} clicked`);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;

      const data = await NotificationService.getNotificationByUser(token);
      setNotifications(data);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.some((notification) => !notification.viewed) && (
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
                    className={`flex flex-col items-start px-4 py-2 space-y-1 cursor-pointer focus:bg-gray-100 focus:text-gray-900 relative ${
                      notification.viewed ? "" : "border-l-4 border-blue-500"
                    }`}
                    onMouseEnter={() => {
                      if (!notification.viewed) {
                        notification.viewed = true;

                        if (!token) return;

                        NotificationService.updateViewed(
                          token,
                          +notification.id
                        );
                      }
                    }}
                  >
                    {notification.viewed ? (
                      ""
                    ) : (
                      <span className="absolute top-5 right-5 h-2 w-2 rounded-full bg-red-500" />
                    )}
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
