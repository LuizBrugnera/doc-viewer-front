import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../security/UseAuth";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import NotificationBell from "./NotificationBell";

const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile-edit");
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Fragment>
      {isAuthenticated ? (
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to={"/home"} className="flex items-center">
                <svg
                  className="h-8 w-auto text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                  <path d="M12 3v6" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">
                  YourLogo
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4 cursor-pointer">
              <NotificationBell />
              <Avatar onClick={goToProfile}>
                <AvatarImage src="/placeholder-user.jpg" alt="Cliente" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
      ) : (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link to={"/"} className="flex items-center">
                  <svg
                    className="h-8 w-auto text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-800">
                    YourLogo
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      aria-label="Open menu"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col space-y-4">
                      <Link
                        to={"/about"}
                        className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Sobre
                      </Link>
                      {/* Add more menu items here as needed */}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      )}
    </Fragment>
  );
};

export default Navbar;
