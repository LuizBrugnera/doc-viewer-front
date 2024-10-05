"use client";

import { useEffect, useState } from "react";

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
import { Document, User } from "@/types/GlobalTypes";
import FolderSistemToUpload from "../FolderSistemToUpload";
import { folderFormat } from "../utils";
import { UserManagement } from "../UserManagement";

export default function DepartmentHomePage({
  foldersAcess,
}: {
  foldersAcess: string[];
}) {
  const { token } = useAuth();
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
        userId: +selectedUser.id,
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

        const data = await UserService.findByDepartment(token);
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
                <FolderSistemToUpload foldersAcess={foldersAcess} />
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
                    {foldersAcess.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folderFormat[folder]}
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

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2023 Nome da Empresa. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
