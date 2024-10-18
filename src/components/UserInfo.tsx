import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/security/UseAuth";

export const UserInfo = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/profile-edit");
  };

  return (
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
              {userInfo?.name ? userInfo.name : "Nome Do Cliente"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userInfo?.email
                ? userInfo.email
                : userInfo?.mainEmail
                ? userInfo.mainEmail
                : "cliente@email.com"}
            </p>
            {userInfo?.cpf && (
              <p className="text-sm text-muted-foreground">
                CPF: {userInfo.cpf}
              </p>
            )}
            {userInfo?.cnpj && (
              <p className="text-sm text-muted-foreground">
                CNPJ: {userInfo.cnpj}
              </p>
            )}
            {userInfo?.rg && (
              <p className="text-sm text-muted-foreground">RG: {userInfo.rg}</p>
            )}
            {userInfo?.phone && (
              <p className="text-sm text-muted-foreground">
                Telefone: {userInfo.phone}
              </p>
            )}
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
  );
};
