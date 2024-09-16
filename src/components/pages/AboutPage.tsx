import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, FileCheck, CreditCard, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Sobre o DocuView
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nossa Missão</CardTitle>
            <CardDescription>
              Simplificando o acesso à sua documentação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              O DocuView é uma plataforma segura e fácil de usar, projetada para
              fornecer acesso rápido e conveniente aos seus documentos
              importantes, exames médicos e informações financeiras. Nossa
              missão é simplificar a gestão de documentos pessoais, permitindo
              que você visualize e gerencie suas informações de qualquer lugar,
              a qualquer momento.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recursos Principais
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Visualização de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesse e visualize seus documentos importantes de forma rápida e
                segura, incluindo contratos, declarações e outros arquivos
                pessoais.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2" />
                Exames Médicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Mantenha seus exames médicos organizados e acessíveis. Visualize
                resultados de exames, prescrições e histórico médico com
                facilidade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Boletos e Faturas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesse seus boletos e faturas em um só lugar. Mantenha-se
                atualizado com suas obrigações financeiras e histórico de
                pagamentos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Segurança e Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sua segurança é nossa prioridade. Utilizamos criptografia de
                ponta a ponta e as mais recentes práticas de segurança para
                proteger suas informações.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Como Começar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Começar a usar o DocuView é fácil! Basta criar uma conta, fazer
              login e começar a carregar seus documentos. Nossa interface
              intuitiva torna simples navegar, visualizar e gerenciar todos os
              seus arquivos importantes.
            </p>
            <p className="mt-4 text-gray-600">
              Se você tiver alguma dúvida ou precisar de assistência, nossa
              equipe de suporte está sempre pronta para ajudar. Estamos
              comprometidos em fornecer a melhor experiência possível para
              nossos usuários.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
