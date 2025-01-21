import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../security/UseAuth";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import NotificationBell from "./NotificationBell";
import LoadingSpinner from "./LoadingSpinner";
import icon from "../assets/icon.png";

const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile-edit");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (user?.department === "exames" || user?.department === "os") {
    return <div></div>;
  }

  return (
    <Fragment>
      {isAuthenticated ? (
        <header
          className={`border-b ${user?.role === "exames" ? "hidden" : ""}`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to={"/home"} className="flex items-center">
                <img src={icon} alt="icon" className="w-11 h-12" />
                <span className="ml-2 text-xl font-bold text-gray-800">
                  Visualizador de Documentos
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
        <nav
          className={`bg-white shadow-sm ${
            user?.role === "exames" ? "hidden" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link to={"/"} className="flex items-center">
                  <img src={icon} alt="icon" className="w-11 h-12" />
                  <span className="ml-2 text-xl font-bold text-gray-800">
                    Visualizador de Documentos
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
