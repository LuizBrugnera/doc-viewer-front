"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import useAuth from "@/security/UseAuth";
import { AuthService } from "@/services/AuthService";

const formatCPF = (value: string) => {
  const cpf = value.replace(/\D/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatCNPJ = (value: string) => {
  const cnpj = value.replace(/\D/g, "");
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export default function LoginPage() {
  const { signIn, signOut } = useAuth();
  const [loginType, setLoginType] = useState("email");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const goToForgot = () => {
    navigate("/forgot-password");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const identifier =
      loginType === "email" ? email : loginType === "cpf" ? cpf : cnpj;

    if (!identifier || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    try {
      if (loginType === "email") {
        const token = await AuthService.login({
          email,
          password,
        });
        signIn(token);
        toast.success("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/home");
        }, 1100);
      } else if (loginType === "cpf") {
        const token = await AuthService.loginCpf({
          cpf,
          password,
        });
        signIn(token);
        toast.success("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/home");
        }, 1100);
      } else if (loginType === "cnpj") {
        const token = await AuthService.loginCnpj({
          cnpj,
          password,
        });
        signIn(token);
        toast.success("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/home");
        }, 1100);
      }
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  useEffect(() => {
    signOut();
  }, []);

  const renderInputField = () => {
    switch (loginType) {
      case "email":
        return (
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        );
      case "cpf":
        return (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              className="pl-10"
              required
              maxLength={14}
            />
          </div>
        );
      case "cnpj":
        return (
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              type="text"
              value={cnpj}
              onChange={handleCNPJChange}
              className="pl-10"
              required
              maxLength={18}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-5xl font-bold text-center mb-1">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Entre com sua conta para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Tabs
              value={loginType}
              onValueChange={setLoginType}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="cpf">CPF</TabsTrigger>
                <TabsTrigger value="cnpj">CNPJ</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {renderInputField()}
                </div>
              </TabsContent>
              <TabsContent value="cpf">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  {renderInputField()}
                </div>
              </TabsContent>
              <TabsContent value="cnpj">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  {renderInputField()}
                </div>
              </TabsContent>
            </Tabs>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={goToForgot}
          >
            Esqueceu sua senha?
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Não tem uma conta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-primary"
              onClick={() => navigate("/register")}
            >
              Registre-se
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
