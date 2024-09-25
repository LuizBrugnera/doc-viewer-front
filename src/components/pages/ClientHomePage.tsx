"use client";

import { useEffect, useState } from "react";
import { FileText, User, Download, Calendar } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import useAuth from "@/security/UseAuth";
import { useNavigate } from "react-router-dom";
import { DocumentService } from "@/services/DocumentService";
import { Document } from "@/types/GlobalTypes";

export default function ClientHomePage() {
  const [activeTab, setActiveTab] = useState("documents");
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const goToProfile = () => {
    navigate("/profile-edit");
  };

  const formatMySqlToBrDate = (date: string) => {
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDownload = async (id: number, fileName: string) => {
    try {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const response = await DocumentService.downloadFile(token, id);
      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download do arquivo:", error);
      alert("Erro ao fazer download do arquivo.");
    }
  };

  const toggleDocumentSelection = (docId: number) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const downloadSelectedDocuments = () => {
    for (const docId of selectedDocuments) {
      const doc = documents.find((d) => d.id === docId);
      if (doc) {
        handleDownload(doc.id, `${doc.name}.${doc.type}`);
      }
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const data = await DocumentService.getFilesByUser(token);
      console.log(data);
      setDocuments(data);
    };

    fetchDocuments();
  }, [token]);

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Seus Documentos</h2>
              {selectedDocuments.length > 0 && (
                <Button onClick={downloadSelectedDocuments}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Selecionados ({selectedDocuments.length})
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id={`doc-${doc.id}`}
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    />
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <p className="text-sm text-gray-500">
                          {formatMySqlToBrDate(doc.date)}
                        </p>
                      </div>
                      <h3 className="text-lg font-semibold">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownload(doc.id, `${doc.name}.${doc.type}`)
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              ))}
            </div>
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
