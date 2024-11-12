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
          Sobre a Betel Seg
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nossa Missão</CardTitle>
            <CardDescription>
              Facilitar o acesso aos seus documentos ocupacionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              A Betel Seg é uma empresa especializada em segurança do trabalho,
              e oferece uma plataforma segura e prática para o gerenciamento de
              documentos essenciais, como boletos, notas fiscais, recibos,
              laudos ocupacionais e relatórios regulatórios. Nossa missão é
              tornar a gestão desses documentos mais simples e acessível.
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
                Acesso rápido e seguro a boletos, notas fiscais, recibos e
                contratos, tudo em um só lugar para sua conveniência.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2" />
                Laudos Ocupacionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Organização e visualização de laudos essenciais, incluindo
                PCMSO, PGR, LTCAT e outros laudos diversos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Relatórios Financeiros e Regulamentares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Disponibilização de relatórios de faturamento e relatórios de
                eventos do eSocial (S-2240, S-2220, S-2210).
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
                ponta e práticas modernas para proteger suas informações.
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
              Criar uma conta é simples. Após o login, carregue seus documentos
              e organize seus arquivos importantes com facilidade.
            </p>
            <p className="mt-4 text-gray-600">
              Em caso de dúvidas, nossa equipe de suporte está disponível para
              ajudar. Nosso compromisso é proporcionar a melhor experiência
              possível.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
