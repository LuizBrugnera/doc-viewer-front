import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 text-red-500">
            <AlertCircle className="h-full w-full" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Página não encontrada
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Oops! A página que você está procurando não existe.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            Parece que você seguiu um link quebrado ou digitou um URL que não
            existe neste site.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/home">
            <Button size="lg">Voltar para a página inicial</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
