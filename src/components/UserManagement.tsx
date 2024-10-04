import { TabsContent } from "@radix-ui/react-tabs";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Download, FileText, Plus, Search, Trash, Users } from "lucide-react";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { DocumentService } from "@/services/DocumentService";
import { Document, User } from "@/types/GlobalTypes";
import useAuth from "@/security/UseAuth";
import { folderFormat } from "./utils";

export const UserManagement = ({
  setIsAddDocumentOpen,
  selectedUser,
  setSelectedUser,
  documents,
  setDocuments,
  users,
}: {
  setIsAddDocumentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  users: User[];
}) => {
  const { token } = useAuth();

  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [documentSearchQuery, setDocumentSearchQuery] = useState("");
  const [usersDisplayed, setUsersDisplayed] = useState(10);

  const handleLoadMoreUsers = () => {
    setUsersDisplayed((prev) => Math.min(prev + 50, 500));
  };
  const handleSelectUser = (client: User) => {
    setSelectedUser(client);
  };

  const handleDownload = async (
    id: number,
    fileName: string,
    userId: number
  ) => {
    try {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const response = await DocumentService.downloadFile(token, id, userId);
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

  const handleDeleteDocument = (documentId: number) => {
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este documento?"
    );

    if (confirmDelete) {
      DocumentService.deleteFile(token, documentId).then(() => {
        setDocuments(documents.filter((doc) => doc.id !== documentId));
      });
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const data = await DocumentService.getFilesByUserDepartment(token);
      setDocuments(data);
    };

    fetchDocuments();
  }, [token]);

  const filteredUsers = users.filter(
    (client) =>
      client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
      folderFormat[doc.folder]
        .toLowerCase()
        .includes(documentSearchQuery.toLowerCase())
  );
  return (
    <TabsContent value="users">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Gerenciar clientes e seus documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  className="flex-grow"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                />
              </div>
              <div className="h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(0, usersDisplayed).map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectUser(client)}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Selecionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {usersDisplayed < 500 &&
                      filteredUsers.length > usersDisplayed && (
                        <div className="text-center w-full mt-4 flex itens-center ">
                          <Button onClick={handleLoadMoreUsers}>
                            Carregar mais
                          </Button>
                        </div>
                      )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos do Cliente</CardTitle>
            <CardDescription>
              {selectedUser
                ? `Documentos de ${selectedUser.name}`
                : "Selecione um cliente para ver os documentos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                <Button onClick={() => setIsAddDocumentOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Documento
                </Button>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar documentos..."
                    className="flex-grow"
                    value={documentSearchQuery}
                    onChange={(e) => setDocumentSearchQuery(e.target.value)}
                  />
                </div>
                <div className="h-80 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome do Documento</TableHead>
                        <TableHead>Pasta</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments
                        .filter((doc) => +doc.userId === +selectedUser.id)
                        .map((document) => (
                          <TableRow key={document.id}>
                            <TableCell>{document.name}</TableCell>
                            <TableCell>
                              {folderFormat[document.folder]}
                            </TableCell>
                            <TableCell>{document.type.toUpperCase()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteDocument(document.id)
                                  }
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownload(
                                      document.id,
                                      document.name,
                                      document.userId
                                    )
                                  }
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>Selecione um cliente para gerenciar seus documentos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
