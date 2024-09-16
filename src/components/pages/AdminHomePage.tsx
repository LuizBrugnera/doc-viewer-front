/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Search, Users, FileText, Plus, Edit, Trash } from "lucide-react";
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

export default function AdminHomePage() {
  const [selectedClient, setSelectedClient] = useState(null as Client | null);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(
    null as Document | null
  );

  // Mock data - replace with actual API calls in a real application

  interface Client {
    id: number;
    name: string;
    email: string;
  }

  interface Document {
    id: number;
    clientId: number;
    name: string;
    type: string;
  }

  const clients = [
    { id: 1, name: "Empresa A", email: "empresaa@example.com" },
    { id: 2, name: "Empresa B", email: "empresab@example.com" },
    { id: 3, name: "Empresa C", email: "empresac@example.com" },
  ];

  const documents = [
    { id: 1, clientId: 1, name: "Contrato.pdf", type: "pdf" },
    { id: 2, clientId: 1, name: "Fatura Janeiro.pdf", type: "pdf" },
    { id: 3, clientId: 2, name: "Proposta.pdf", type: "pdf" },
  ];

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleAddDocument = (e: any) => {
    e.preventDefault();
    // Implement document addition logic here
    setIsAddDocumentOpen(false);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setIsEditDocumentOpen(true);
  };

  const handleUpdateDocument = (e: any) => {
    e.preventDefault();
    // Implement document update logic here
    setIsEditDocumentOpen(false);
  };

  const handleDeleteDocument = (documentId: number) => {
    // Implement document deletion logic here
    console.log(`Deleting document with ID ${documentId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
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
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectClient(client)}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos do Cliente</CardTitle>
              <CardDescription>
                {selectedClient
                  ? `Documentos de ${selectedClient.name}`
                  : "Selecione um cliente para ver os documentos"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                <div className="space-y-4">
                  <Button onClick={() => setIsAddDocumentOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Documento
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome do Documento</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents
                        .filter((doc) => doc.clientId === selectedClient.id)
                        .map((document) => (
                          <TableRow key={document.id}>
                            <TableCell>{document.name}</TableCell>
                            <TableCell>{document.type.toUpperCase()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditDocument(document)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
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
              ) : (
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Selecione um cliente para gerenciar seus documentos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select required>
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
                <Label htmlFor="documentFile">Arquivo</Label>
                <Input id="documentFile" type="file" required />
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
