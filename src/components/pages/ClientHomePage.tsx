"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/security/UseAuth";
import { useNavigate } from "react-router-dom";

import FolderSistem from "../FolderSistem";

export default function ClientHomePage() {
  const [activeTab, setActiveTab] = useState("documents");
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile-edit");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="account">Minha Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="documents" className="space-y-4">
            <FolderSistem />
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e preferências
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" alt="Cliente" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="text-xl font-semibold">
                      {user?.name ? user.name : "Nome Do Cliente"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email ? user.email : "cliente@email.com"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CPF: {user?.cpf ? user.cpf : "000.000.000-00"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Data de Nascimento:{" "}
                      {user?.birthdate ? user.birthdate : "01/01/1990"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={goToProfile}
                >
                  <User className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2023 Nome da Empresa. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
