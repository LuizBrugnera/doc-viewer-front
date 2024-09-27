"use client";

import { useEffect, useState } from "react";
import { Search, Users, FileText, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Document, UserCustomer } from "@/types/GlobalTypes";
import FolderSistemToUpload from "../FolderSistemToUpload";

export default function DepartmentHomePage() {
  const { token, user } = useAuth();
  const [selectedUserCustomer, setSelectedUserCustomer] =
    useState<UserCustomer | null>(null);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentDescription, setNewDocumentDescription] = useState("");
  const [newDocumentFolder, setNewDocumentFolder] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [foldersAcess, setFoldersAcess] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<UserCustomer[]>([]);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [documentSearchQuery, setDocumentSearchQuery] = useState("");

  const folderFormat = {
    boletos: "Boletos",
    notasFiscais: "Notas Fiscais",
    recibos: "Recibos",
    laudosPCMSO: "Laudos PCMSO",
    laudosPGR: "Laudos PGR",
    laudosLTCAT: "Laudos LTCAT",
    laudosDiversos: "Laudos Diversos",
    relatorioFaturamento: "Relatório de Faturamento",
    relatorioEventoS2240: "Relatório Evento S-2240",
    relatorioEventoS2220: "Relatório Evento S-2220",
    relatorioEventoS2210: "Relatório Evento S-2210",
    contratos: "Contratos",
    ordensServico: "Ordens de Serviço",
  } as { [key: string]: string };

  const handleSelectUserCustomer = (client: UserCustomer) => {
    setSelectedUserCustomer(client);
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDocumentFile || !selectedUserCustomer || !newDocumentFolder) {
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
      if (!token || !selectedUserCustomer) {
        alert("Token ou cliente não encontrado");
        return;
      }

      const result = await DocumentService.uploadFile(
        token,
        selectedUserCustomer.id,
        formData
      );

      const newDoc: Document = {
        id: result.id,
        userId: +selectedUserCustomer.id,
        name: newDocumentName,
        type: newDocumentDescription,
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

  useEffect(() => {
    const foldersToAcess = {
      financeiro: ["boletos", "notasFiscais", "recibos"],
      documentosTecnicos: [
        "laudosPCMSO",
        "laudosPGR",
        "laudosLTCAT",
        "laudosDiversos",
      ],
      faturamento: ["relatorioFaturamento"],
      esocial: [
        "relatorioEventoS-2240",
        "relatorioEventoS-2220",
        "relatorioEventoS-2210",
      ],
      vendas: ["contratos", "ordensServico"],
    } as { [key: string]: string[] };

    if (!token || !user) {
      return;
    }

    const folders = foldersToAcess[user.department];
    setFoldersAcess(folders);
  }, [token, user]);

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-2 py-8">
        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Administração de Usuários</TabsTrigger>
            <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
          </TabsList>
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
                          {filteredUsers.map((client) => (
                            <TableRow key={client.id}>
                              <TableCell>{client.name}</TableCell>
                              <TableCell>{client.email}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleSelectUserCustomer(client)
                                  }
                                >
                                  <Users className="w-4 h-4 mr-2" />
                                  Selecionar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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
                    {selectedUserCustomer
                      ? `Documentos de ${selectedUserCustomer.name}`
                      : "Selecione um cliente para ver os documentos"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedUserCustomer ? (
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
                          onChange={(e) =>
                            setDocumentSearchQuery(e.target.value)
                          }
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
                              .filter(
                                (doc) => doc.userId === selectedUserCustomer.id
                              )
                              .slice(0, 10)
                              .map((document) => (
                                <TableRow key={document.id}>
                                  <TableCell>{document.name}</TableCell>
                                  <TableCell>
                                    {folderFormat[document.folder]}
                                  </TableCell>
                                  <TableCell>
                                    {document.type.toUpperCase()}
                                  </TableCell>
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
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload em massa de Arquivos</CardTitle>
                <CardDescription>
                  Arraste e solte arquivos ou clique para selecionar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FolderSistemToUpload />
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
