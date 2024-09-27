"use client";

import { useState } from "react";
import {
  Search,
  Users,
  FileText,
  Plus,
  Edit,
  Trash,
  Eye,
  AlertTriangle,
} from "lucide-react";
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
import { Department, Log, UserCustomer } from "@/types/GlobalTypes";

export default function AdminHomePage() {
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [editingClient, setEditingClient] = useState<UserCustomer | null>(null);
  const [isDeleteDepartmentOpen, setIsDeleteDepartmentOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);
  const [deletingClient, setDeletingClient] = useState<UserCustomer | null>(
    null
  );
  // truncate table to tests
  const companies: Department[] = [
    { id: 1, name: "Empresa A", email: "empresaa@example.com" },
    { id: 2, name: "Empresa B", email: "empresab@example.com" },
  ];
  // truncate table to tests
  const clients: UserCustomer[] = [
    {
      id: 1,
      departmentId: 1,
      name: "Cliente A1",
      email: "clientea1@example.com",
    },
    {
      id: 2,
      departmentId: 1,
      name: "Cliente A2",
      email: "clientea2@example.com",
    },
    {
      id: 3,
      departmentId: 2,
      name: "Cliente B1",
      email: "clienteb1@example.com",
    },
  ];
  // truncate table to tests
  const logs: Log[] = [
    {
      id: 1,
      departmentId: 1,
      action: "Login",
      timestamp: "2023-06-01 10:00:00",
    },
    {
      id: 2,
      departmentId: 1,
      action: "Documento adicionado",
      timestamp: "2023-06-01 11:30:00",
    },
    {
      id: 3,
      departmentId: 2,
      action: "Cliente adicionado",
      timestamp: "2023-06-02 09:15:00",
    },
  ];

  const handleSelectDepartment = (department: Department | null) => {
    setSelectedDepartment(department);
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement department addition logic here
    setIsAddDepartmentOpen(false);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setIsEditDepartmentOpen(true);
  };

  const handleUpdateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement department update logic here
    setIsEditDepartmentOpen(false);
  };

  const handleDeleteDepartment = (department: Department) => {
    setDeletingDepartment(department);
    setIsDeleteDepartmentOpen(true);
  };

  const confirmDeleteDepartment = () => {
    if (deletingDepartment) {
      // Implement department deletion logic here
      console.log(`Deleting department with ID ${deletingDepartment.id}`);
      setIsDeleteDepartmentOpen(false);
      setDeletingDepartment(null);
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement client addition logic here
    setIsAddClientOpen(false);
  };

  const handleEditClient = (client: UserCustomer) => {
    setEditingClient(client);
    setIsEditClientOpen(true);
  };

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement client update logic here
    setIsEditClientOpen(false);
  };

  const handleDeleteClient = (client: UserCustomer) => {
    setDeletingClient(client);
    setIsDeleteClientOpen(true);
  };

  const confirmDeleteClient = () => {
    if (deletingClient) {
      // Implement client deletion logic here
      console.log(`Deleting client with ID ${deletingClient.id}`);
      setIsDeleteClientOpen(false);
      setDeletingClient(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
        <Tabs defaultValue="companies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Empresas</CardTitle>
                <CardDescription>
                  Adicione, edite ou remova empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar empresas..."
                        className="w-64"
                      />
                    </div>
                    <Button onClick={() => setIsAddDepartmentOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Empresa
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((department) => (
                        <TableRow key={department.id}>
                          <TableCell>{department.name}</TableCell>
                          <TableCell>{department.email}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSelectDepartment(department)
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditDepartment(department)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteDepartment(department)
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Clientes</CardTitle>
                <CardDescription>
                  Visualize e gerencie clientes por empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Select
                      onValueChange={(value) =>
                        handleSelectDepartment(
                          companies.find((c) => c.id === parseInt(value)) ||
                            null
                        )
                      }
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Selecione uma empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => setIsAddClientOpen(true)}
                      disabled={!selectedDepartment}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Cliente
                    </Button>
                  </div>
                  {selectedDepartment ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients
                          .filter(
                            (client) =>
                              client.departmentId === selectedDepartment.id
                          )
                          .map((client) => (
                            <TableRow key={client.id}>
                              <TableCell>{client.name}</TableCell>
                              <TableCell>{client.email}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditClient(client)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteClient(client)}
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4" />
                      <p>Selecione uma empresa para ver seus clientes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Logs das Empresas</CardTitle>
                <CardDescription>
                  Visualize os logs de atividade das empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    onValueChange={(value) =>
                      handleSelectDepartment(
                        companies.find((c) => c.id === parseInt(value)) || null
                      )
                    }
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((department) => (
                        <SelectItem
                          key={department.id}
                          value={department.id.toString()}
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDepartment ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ação</TableHead>
                          <TableHead>Data e Hora</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs
                          .filter(
                            (log) => log.departmentId === selectedDepartment.id
                          )
                          .map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>{log.action}</TableCell>
                              <TableCell>{log.timestamp}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <p>Selecione uma empresa para ver seus logs</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Department Dialog */}
      <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Empresa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova empresa.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDepartment}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departmentName">Nome da Empresa</Label>
                <Input
                  id="departmentName"
                  placeholder="Digite o nome da empresa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentEmail">Email da Empresa</Label>
                <Input
                  id="departmentEmail"
                  type="email"
                  placeholder="empresa@example.com"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Adicionar Empresa</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog
        open={isEditDepartmentOpen}
        onOpenChange={setIsEditDepartmentOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize as informações da empresa.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDepartment}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editDepartmentName">Nome da Empresa</Label>
                <Input
                  id="editDepartmentName"
                  placeholder="Digite o nome da empresa"
                  value={editingDepartment?.name || ""}
                  onChange={(e) =>
                    setEditingDepartment(
                      editingDepartment
                        ? { ...editingDepartment, name: e.target.value }
                        : null
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDepartmentEmail">Email da Empresa</Label>
                <Input
                  id="editDepartmentEmail"
                  type="email"
                  placeholder="empresa@example.com"
                  value={editingDepartment?.email || ""}
                  onChange={(e) =>
                    setEditingDepartment(
                      editingDepartment
                        ? { ...editingDepartment, email: e.target.value }
                        : null
                    )
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Atualizar Empresa</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add UserCustomer Dialog */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo cliente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Digite o nome do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email do Cliente</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="cliente@example.com"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Adicionar Cliente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit UserCustomer Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClient}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editClientName">Nome do Cliente</Label>
                <Input
                  id="editClientName"
                  placeholder="Digite o nome do cliente"
                  value={editingClient?.name || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, name: e.target.value }
                        : null
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClientEmail">Email do Cliente</Label>
                <Input
                  id="editClientEmail"
                  type="email"
                  placeholder="cliente@example.com"
                  value={editingClient?.email || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, email: e.target.value }
                        : null
                    )
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Atualizar Cliente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Department Confirmation Dialog */}
      <Dialog
        open={isDeleteDepartmentOpen}
        onOpenChange={setIsDeleteDepartmentOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão de Empresa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-yellow-100 rounded-md">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <p className="text-yellow-700">
              Todos os clientes e dados associados serão removidos.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDepartmentOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDepartment}>
              Excluir Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete UserCustomer Confirmation Dialog */}
      <Dialog open={isDeleteClientOpen} onOpenChange={setIsDeleteClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão de Cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-yellow-100 rounded-md">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <p className="text-yellow-700">
              Todos os dados associados a este cliente serão removidos.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteClientOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteClient}>
              Excluir Cliente
            </Button>
          </DialogFooter>
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
