"use client";

import { Fragment, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentService } from "@/services/DocumentService";
import useAuth from "@/security/UseAuth";
import { UserService } from "@/services/UserService";
import { Document, ResponseUpload, User } from "@/types/GlobalTypes";
import FolderSistemToUpload from "../FolderSistemToUpload";
import { folderFormat, formatMySqlToBrDate, stateFormat } from "../utils";
import { UserManagement } from "../UserManagement";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function DepartmentHomePage() {
  const { token, user, userInfo, updateUserInfo } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentDescription, setNewDocumentDescription] = useState("");
  const [newDocumentFolder, setNewDocumentFolder] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isErrorUploadOpen, setIsErrorUploadOpen] = useState(false);
  const [filesErrorToUpload, setFilesErrorToUpload] = useState<
    ResponseUpload[]
  >([]);
  const [filesSuccessToUpload, setFilesSuccessToUpload] = useState<
    ResponseUpload[]
  >([]);
  console.log(userInfo);
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDocumentFile || !selectedUser || !newDocumentFolder) {
      alert("Por favor, preencha todos os campos e selecione um cliente.");
      return;
    }

    const formData = new FormData();
    formData.append("document", newDocumentFile);
    formData.append("name", newDocumentName);
    formData.append("folder", newDocumentFolder);
    formData.append(
      "description",
      newDocumentDescription
        ? newDocumentDescription
        : `Arquivo ${newDocumentName}`
    );

    try {
      if (!token || !selectedUser) {
        alert("Token ou cliente não encontrado");
        return;
      }

      const result = await DocumentService.uploadFile(
        token,
        +selectedUser.id,
        formData
      );

      const newDoc: Document = {
        id: result.id,
        user: selectedUser,
        name: newDocumentName,
        type: newDocumentFile.name.split(".").pop() || "",
        date: new Date().toISOString(),
        description: newDocumentDescription,
        folder: newDocumentFolder,
      };
      setDocuments([...documents, newDoc]);
      setNewDocumentName("");
      setNewDocumentDescription("");
      setNewDocumentFile(null);
      setIsAddDocumentOpen(false);
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      alert("Erro ao fazer upload do arquivo.");
    }
  };
  function extractId(text: string) {
    const match = text.match(/\{(\d+)\}/);
    return match ? parseInt(match[1], 10) : null;
  }
  const handleHoldDocument = async (docId: number, logId: number) => {
    DocumentService.holdDocument(token!, docId, logId).then(() => {
      updateUserInfo();
    });
  };

  const handleDiscartDocument = async (docId: number, logId: number) => {
    DocumentService.discartDocument(token!, docId, logId).then(() => {
      updateUserInfo();
    });
  };

  const handleUpdateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditDocumentOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          alert("Usuário não autenticado.");
          return;
        }

        const data = await UserService.findAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        alert("Erro ao buscar clientes.");
      }
    };

    fetchUsers();
  }, [token]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-2 py-8">
        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Administração de Usuários</TabsTrigger>
            <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
            <TabsTrigger value="historic">Meu Histórico</TabsTrigger>
          </TabsList>
          <UserManagement
            documents={documents}
            selectedUser={selectedUser}
            setDocuments={setDocuments}
            setIsAddDocumentOpen={setIsAddDocumentOpen}
            setSelectedUser={setSelectedUser}
            users={users}
          />
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload em massa de Arquivos</CardTitle>
                <CardDescription>
                  Arraste e solte arquivos ou clique para selecionar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FolderSistemToUpload
                  foldersAcess={user?.folderAccess}
                  setFilesErrorToUpload={setFilesErrorToUpload}
                  setIsErrorUploadOpen={setIsErrorUploadOpen}
                  setFilesSuccessToUpload={setFilesSuccessToUpload}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="historic">
            <Card>
              <CardHeader>
                <CardTitle>Meus Histórico</CardTitle>
                <CardDescription>
                  Visualize o status das suas ações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ação</TableHead>
                        <TableHead>Data e Hora</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Meus Controles</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userInfo &&
                        userInfo.logs &&
                        userInfo!.logs
                          .sort((a, b) => {
                            const dateComparison =
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime();
                            if (dateComparison !== 0) return dateComparison;
                            return a.action.localeCompare(b.action);
                          })
                          .map((log, index, logsArray) => {
                            const previousLog = logsArray[index - 1];
                            const isNewDay =
                              !previousLog ||
                              new Date(log.date).toDateString() !==
                                new Date(previousLog.date).toDateString();

                            return (
                              <Fragment key={log.id}>
                                {isNewDay && (
                                  <>
                                    {index !== 0 && <tr className="h-4" />}{" "}
                                    {/* Linha em branco entre dias */}
                                    <TableRow>
                                      <TableCell
                                        colSpan={4}
                                        className="text-left"
                                      >
                                        <strong>
                                          {new Date(
                                            log.date
                                          ).toLocaleDateString("pt-BR", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </strong>
                                      </TableCell>
                                    </TableRow>
                                  </>
                                )}
                                <TableRow>
                                  <TableCell>{log.action}</TableCell>
                                  <TableCell>
                                    {formatMySqlToBrDate(log.date)}
                                  </TableCell>
                                  <TableCell>
                                    {log.state
                                      ? stateFormat[log.state]
                                      : "Sucesso!"}
                                  </TableCell>
                                  <TableCell>{log.description}</TableCell>
                                  <TableCell>
                                    {log.state === "failure" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => console.log("Delete")}
                                      >
                                        Tentar Enviar Novamente
                                      </Button>
                                    )}
                                    {log.state === "conflict" && (
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleHoldDocument(
                                              +extractId(log.description)!,
                                              log.id
                                            )
                                          }
                                        >
                                          Enviar
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="ml-2"
                                          onClick={() =>
                                            handleDiscartDocument(
                                              +extractId(log.description)!,
                                              log.id
                                            )
                                          }
                                        >
                                          Excluir
                                        </Button>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              </Fragment>
                            );
                          })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Documento</DialogTitle>
            <DialogDescription>
              Adicione um novo documento para o cliente selecionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDocument}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentName">Nome do Documento</Label>
                <Input
                  id="documentName"
                  placeholder="Digite o nome do documento"
                  required
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentFolder">Pasta</Label>
                <Select
                  value={newDocumentFolder}
                  onValueChange={(value) => setNewDocumentFolder(value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pasta" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.folderAccess?.map((folder) => (
                      <SelectItem
                        key={folder.foldername}
                        value={folder.foldername}
                      >
                        {folderFormat[folder.foldername]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentDescription">Descrição</Label>
                <Input
                  id="documentDescription"
                  placeholder="Digite uma descrição para o documento"
                  required
                  value={newDocumentDescription}
                  onChange={(e) => setNewDocumentDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentFile">Arquivo</Label>
                <Input
                  id="documentFile"
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setNewDocumentFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Adicionar Documento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDocumentOpen} onOpenChange={setIsEditDocumentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>
              Atualize as informações do documento.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDocument}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editDocumentName">Nome do Documento</Label>
                <Input
                  id="editDocumentName"
                  placeholder="Digite o nome do documento"
                  value={editingDocument?.name || ""}
                  onChange={(e) =>
                    setEditingDocument({
                      ...editingDocument!,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDocumentType">Tipo de Documento</Label>
                <Select
                  value={editingDocument?.type || ""}
                  onValueChange={(value) =>
                    setEditingDocument({ ...editingDocument!, type: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="xls">XLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDocumentFile">
                  Novo Arquivo (opcional)
                </Label>
                <Input id="editDocumentFile" type="file" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Atualizar Documento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isErrorUploadOpen} onOpenChange={setIsErrorUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Status dos Documentos </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <DialogTitle>Documentos não enviados corretamente</DialogTitle>
            <div className="grid gap-4 py-4">
              {filesErrorToUpload.map((errorUpload) => {
                return (
                  <div
                    key={errorUpload.name}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor="name" className="text-left col-span-1">
                      Nome do Arquivo
                    </Label>
                    <div id="name" className="col-span-3 text-left">
                      {errorUpload.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <DialogTitle>Documentos enviados com sucesso</DialogTitle>
            <div className="grid gap-4 py-4">
              {filesSuccessToUpload.map((successUpload) => {
                return (
                  <div
                    key={successUpload.name}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label
                      htmlFor="name"
                      className="text-left col-span-1 space-y-4"
                    >
                      Nome do Arquivo
                    </Label>
                    <div id="name" className="col-span-3 text-left">
                      {successUpload.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2023 Nome da Empresa. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
