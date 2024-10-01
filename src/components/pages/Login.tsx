"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
import useAuth from "../../security/UseAuth";
import { AuthService } from "../../services/AuthService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    signOut();
  }, [signOut]);

  const goToForgot = () => {
    navigate("/forgot-password");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    try {
      const token = await AuthService.login({ email, password });
      signIn(token);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        navigate("/home");
      }, 1100);
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.log(error);
    } finally {
      setIsLoading(false);
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
          <form onSubmit={handleLogin} className="space-y-4 ">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const passwordInput = document.getElementById(
                        "password"
                      ) as HTMLInputElement;
                      if (passwordInput) {
                        passwordInput.focus();
                      }
                    }
                  }}
                />
              </div>
            </div>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin(e);
                    }
                  }}
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
