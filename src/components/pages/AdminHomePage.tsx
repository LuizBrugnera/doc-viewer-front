"use client";

import { useEffect, useState } from "react";
import { Search, FileText, Plus, Edit, Trash, Eye } from "lucide-react";
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
import {
  Department,
  Document,
  FoldersAccess,
  ResponseUpload,
  User,
} from "@/types/GlobalTypes";
import useAuth from "@/security/UseAuth";
import { UserService } from "@/services/UserService";
import { folderFormat, foldersToAcess, folderUpFoldersFormat } from "../utils";
import FolderSistemToUpload from "../FolderSistemToUpload";
import { ScrollArea } from "../ui/scroll-area";
import { UserManagement } from "../UserManagement";
import { DocumentService } from "@/services/DocumentService";
import { DepartmentService } from "@/services/DepartmentService";
import { AuthService } from "@/services/AuthService";
import DeleteConfirmationDialog from "../DeleteConfirmationDialogProps";
import LogTable from "../LogTable";
import HistoryTable from "../HistoryTable";
import DepartmentDialog from "../DepartmentDialog";
import ClientDialog from "../ClientDialog";

export default function AdminHomePage() {
  interface DepartmentForm {
    id?: string | number;
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    department: string;
    foldersAccess: FoldersAccess[];
    emailTemplate: string;
  }

  const initialDepartmentForm: DepartmentForm = {
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    department: "financeiro",
    foldersAccess: [],
    emailTemplate: "",
  };

  interface ClientForm {
    id?: string | number;
    name: string;
    mainEmail: string;
    phone: string;
    rg: string;
    cnpj: string;
    cod: string;
    password: string;
    confirmPassword: string;
  }

  const initialClientForm: ClientForm = {
    id: "",
    name: "",
    mainEmail: "",
    phone: "",
    rg: "",
    cnpj: "",
    cod: "",
    password: "",
    confirmPassword: "",
  };

  const [addClientForm, setAddClientForm] = useState(initialClientForm);
  const [editingClient, setEditingClient] = useState(initialClientForm);

  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [addDepartmentForm, setAddDepartmentForm] = useState(
    initialDepartmentForm
  );
  const [editingDepartment, setEditingDepartment] = useState(
    initialDepartmentForm
  );
  const { token, userInfo, updateUserInfo } = useAuth();
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isErrorUploadOpen, setIsErrorUploadOpen] = useState(false);
  const [filesErrorToUpload, setFilesErrorToUpload] = useState<
    ResponseUpload[]
  >([]);
  const [filesSuccessToUpload, setFilesSuccessToUpload] = useState<
    ResponseUpload[]
  >([]);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [isDataDepartmentOpen, setIsDataDepartmentOpen] = useState(false);
  const [seeDataDepartment, setSeeDataDepartment] = useState<Department | null>(
    null
  );

  const [isDeleteDepartmentOpen, setIsDeleteDepartmentOpen] = useState(false);
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false);
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);
  const [deletingClient, setDeletingClient] = useState<User | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);

  const [usersDisplayed, setUsersDisplayed] = useState(50);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentDescription, setNewDocumentDescription] = useState("");
  const [newDocumentFolder, setNewDocumentFolder] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const handleLoadMoreUsers = () => {
    setUsersDisplayed((prev) => Math.min(prev + 100, 3500));
  };
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      client.mainEmail.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const fetchDepartments = async () => {
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }
    const data = await DepartmentService.findAllDepartaments(token);
    setDepartments(data);
  };

  const fetchDocuments = async () => {
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const data = await DocumentService.getAllDocuments(token);
    setDocuments(data);
  };

  const fetchClients = async () => {
    try {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const data = await UserService.findAllUsers(token);

      setClients(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      alert("Erro ao buscar clientes.");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchClients();
    fetchDocuments();
  }, [token]);

  useEffect(() => {
    setEditingClient({
      id: 1,
      name: "",
      mainEmail: "",
      phone: "",
      rg: "",
      cnpj: "",
      password: "",
      confirmPassword: "",
      cod: "",
    });
  }, [isAddClientOpen]);

  const handleSelectDepartment = (department: Department | null) => {
    setSelectedDepartment(department);
  };

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

      await DocumentService.uploadFile(token, +selectedUser.id, formData);

      await fetchDocuments();
      setNewDocumentName("");
      setNewDocumentDescription("");
      setNewDocumentFile(null);
      setIsAddDocumentOpen(false);
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      alert("Erro ao fazer upload do arquivo.");
    }
  };

  const handleSelectDepartmentData = (department: Department | null) => {
    setSeeDataDepartment(department);
    setIsDataDepartmentOpen(true);
  };

  const handleAddDepartment = async () => {
    if (addDepartmentForm) {
      if (addDepartmentForm.password !== addDepartmentForm.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      const data = {
        name: addDepartmentForm.name.trim(),
        email: addDepartmentForm.email.trim(),
        phone: addDepartmentForm.phone.trim(),
        password: addDepartmentForm.password.trim(),
        department: addDepartmentForm.department,
        foldersAccess: addDepartmentForm.foldersAccess,
        emailTemplate: addDepartmentForm.emailTemplate.trim(),
      };

      if (!token) {
        alert("Token expirado! Logue novamente.");
        return;
      }
      await AuthService.register.department(data, token);
      await fetchDepartments();

      setAddDepartmentForm(initialDepartmentForm);
      setIsAddDepartmentOpen(false);
    }
    setIsAddDepartmentOpen(false);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment({
      id: department.id,
      name: department.name,
      email: department.email,
      phone: department.phone || "",
      password: "",
      confirmPassword: "",
      department: department.department,
      foldersAccess: department.foldersAccess,
      emailTemplate: department.emailTemplate,
    });
    setIsEditDepartmentOpen(true);
  };

  const handleUpdateDepartment = async () => {

    if (editingDepartment) {
      if (editingDepartment.password !== editingDepartment.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      const data = {
        id: +editingDepartment.id!,
        name: editingDepartment.name.trim(),
        email: editingDepartment.email.trim(),
        password: editingDepartment.password.trim(),
        department: editingDepartment.department,
        phone: editingDepartment.phone.trim(),
        role: "department",
        foldersAccess: editingDepartment.foldersAccess,
        emailTemplate: editingDepartment.emailTemplate.trim(),
      };

      if (!token) {
        alert("Token expirado! Logue novamente.");
        return;
      }
      await DepartmentService.updateDepartment(token, data);

      await fetchDepartments();

      setEditingDepartment(initialDepartmentForm);
      setIsEditDepartmentOpen(false);
    }
    setIsEditDepartmentOpen(false);
  };

  const handleDeleteDepartment = (department: Department) => {
    setDeletingDepartment(department);
    setIsDeleteDepartmentOpen(true);
  };

  const confirmDeleteDepartment = () => {
    if (deletingDepartment) {
      if (!token) {
        alert("Token expirado! Logue novamente.");
        return;
      }

      DepartmentService.deleteDepartment(token, +deletingDepartment.id).then(
        () => {
          setDeletingDepartment(null);
          setIsDeleteDepartmentOpen(false);
          fetchDepartments();
        }
      );
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (
      !editingClient.name ||
      !editingClient.mainEmail ||
      !editingClient?.password
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!editingClient.password !== !editingClient.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const data = {
      name: editingClient.name,
      mainEmail: editingClient.mainEmail,
      password: editingClient.password,
      confirmPassword: editingClient.confirmPassword,
      rg: editingClient.rg,
      cnpj: editingClient.cnpj,
      department: "user",
      role: "user",
    };

    if (!token) {
      alert("Token expirado! Logue novamente.");
      return;
    }
    await UserService.createUser(token, data);

    await fetchClients();

    setIsAddClientOpen(false);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingClient) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!editingClient.password !== !editingClient.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const data = {
      id: +editingClient.id!,
      name: editingClient.name,
      mainEmail: editingClient.mainEmail,
      password: editingClient.password,
      phone: editingClient.phone,
      cod: editingClient.cod,
      rg: editingClient.rg,
      cnpj: editingClient.cnpj,
    };

    if (!token) {
      alert("Token expirado! Logue novamente.");
      return;
    }
    await UserService.updateInfo(token, data);

    await fetchClients();

    setIsEditClientOpen(false);
  };

  const handleEditClient = (client: User) => {
    setEditingClient({
      id: +client.id,
      name: client.name,
      mainEmail: client.mainEmail,
      cod: client.cod || "",
      phone: client.phone || "",
      rg: client.rg || "",
      cnpj: client.cnpj || "",
      password: client.password || "",
      confirmPassword: "",
    });
    setIsEditClientOpen(true);
  };

  const handleDeleteClient = (client: User) => {
    setDeletingClient(client);
    setIsDeleteClientOpen(true);
  };

  const confirmDeleteClient = () => {
    if (deletingClient) {
      if (!token) {
        alert("Token expirado! Logue novamente.");
        return;
      }

      UserService.deleteUser(token, +deletingClient.id).then(() => {
        setDeletingClient(null);
        setIsDeleteClientOpen(false);
        fetchClients();
      });
      setIsDeleteClientOpen(false);
      setDeletingClient(null);
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="clients">Usuários</TabsTrigger>
            <TabsTrigger value="users">Documentos de Usuários</TabsTrigger>
            <TabsTrigger value="upload">Enviar Arquivos</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="historic">Meu Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Departamentos</CardTitle>
                <CardDescription>
                  Adicione, edite ou remova departamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar departamentos..."
                        className="w-64"
                      />
                    </div>
                    <Button onClick={() => setIsAddDepartmentOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Departamento
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departments.map((department) => (
                        <TableRow key={department.id}>
                          <TableCell>{department.name}</TableCell>
                          <TableCell>{department.email}</TableCell>
                          <TableCell>
                            {folderUpFoldersFormat[department.department]}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSelectDepartmentData(department)
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
                <div className="flex items-center justify-between">
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <CardDescription>
                    Usuários Cadastrados - {clients.length}
                  </CardDescription>
                </div>

                <CardDescription>
                  Visualize e gerencie clientes por empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar clientes..."
                        className="flex-grow"
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => setIsAddClientOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {" "}
                      {filteredUsers.slice(0, usersDisplayed).map((client) => (
                        <TableRow key={client.id}>
                          {" "}
                          <TableCell>{client.name}</TableCell>{" "}
                          <TableCell>{client.mainEmail}</TableCell>{" "}
                          <TableCell>{client.cnpj}</TableCell>{" "}
                          <TableCell>
                            {" "}
                            <div className="flex space-x-2">
                              {" "}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClient(client)}
                              >
                                {" "}
                                <Edit className="w-4 h-4" />{" "}
                              </Button>{" "}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClient(client)}
                              >
                                {" "}
                                <Trash className="w-4 h-4" />{" "}
                              </Button>{" "}
                            </div>{" "}
                          </TableCell>
                          {/*<TableCell> <Button variant="outline" size="sm" onClick={() => handleSelectUserCustomer(client)} > <Users className="w-4 h-4 mr-2" /> Selecionar </Button> </TableCell> */}{" "}
                        </TableRow>
                      ))}{" "}
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
              </CardContent>
            </Card>
          </TabsContent>
          <UserManagement
            setIsAddDocumentOpen={setIsAddDocumentOpen}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            documents={documents}
            setDocuments={setDocuments}
            users={clients}
          />

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Logs dos Departamentos</CardTitle>
                <CardDescription>
                  Visualize os logs de atividade dos departamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select
                    id="departmentDepartment"
                    value={selectedDepartment?.id || ""}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      handleSelectDepartment(
                        departments.find(
                          (department) =>
                            department.id.toString() === selectedValue
                        ) || null
                      );
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="" disabled>
                      Selecione uma empresa
                    </option>
                    {departments.map((department) => (
                      <option
                        key={department.id}
                        value={department.id.toString()}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>

                  {selectedDepartment ? (
                    <LogTable logs={selectedDepartment?.logs || []} />
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
                  <HistoryTable
                    logs={userInfo?.adminLogs || []}
                    onRetry={(logId) => console.log(`Retrying log ${logId}`)}
                    onHold={handleHoldDocument}
                    onDiscard={handleDiscartDocument}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <DepartmentDialog
        isOpen={isAddDepartmentOpen || isEditDepartmentOpen}
        onClose={() => {
          setIsAddDepartmentOpen(false);
          setIsEditDepartmentOpen(false);
        }}
        onSave={(data) => {
          if (isAddDepartmentOpen) {
            handleAddDepartment();
          } else {
            handleUpdateDepartment();
          }
        }}
        formData={isAddDepartmentOpen ? addDepartmentForm : editingDepartment}
        onChange={(field, value, field2?, value2?) => {
          if (isAddDepartmentOpen) {
            setAddDepartmentForm({
              ...addDepartmentForm,
              [field]: value,
              ...(field2 && value2 ? { [field2]: value2 } : {}),
            });
          } else {
            setEditingDepartment({
              ...editingDepartment,
              [field]: value,
              ...(field2 && value2 ? { [field2]: value2 } : {}),
            });
          }
        }}
        availableFolders={folderFormat}
        isEditMode={!isAddDepartmentOpen}
      />

      <ClientDialog
        isOpen={isAddClientOpen || isEditClientOpen}
        onClose={() => {
          setIsAddClientOpen(false);
          setIsEditClientOpen(false);
        }}
        onSave={(data) => {
          if (isAddClientOpen) {
            handleAddClient(data);
            setAddClientForm(initialClientForm);
          } else {
            handleUpdateClient(data);
          }
        }}
        formData={isAddClientOpen ? addClientForm : editingClient}
        onChange={(field, value) => {
          if (isAddClientOpen) {
            setAddClientForm({ ...addClientForm, [field]: value });
          } else {
            setEditingClient({ ...editingClient, [field]: value });
          }
        }}
        isEditMode={!isAddClientOpen}
      />

      <Dialog open={isErrorUploadOpen} onOpenChange={setIsErrorUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Status dos Documentos </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <DialogTitle>Documentos não enviados corretamente</DialogTitle>
              {filesErrorToUpload.map((errorUpload) => {
                return (
                  <div
                    key={errorUpload.name}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor="name" className="text-left col-span-1">
                      {errorUpload.status === 409
                        ? "Conflito Com Arquivo"
                        : "Nome do Arquivo:"}
                    </Label>
                    <div id="name" className="col-span-3 text-left">
                      {errorUpload.name}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 py-4">
              <DialogTitle>Documentos enviados com sucesso</DialogTitle>
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
      <Dialog
        open={isDataDepartmentOpen}
        onOpenChange={setIsDataDepartmentOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Departamento</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-left col-span-1">
                  Nome
                </Label>
                <div id="name" className="col-span-3 text-left">
                  {seeDataDepartment?.name}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-left col-span-1">
                  Email
                </Label>
                <div id="email" className="col-span-3 text-left">
                  {seeDataDepartment?.email}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-left col-span-1">
                  Departamento
                </Label>
                <div id="department" className="col-span-3 text-left">
                  {folderUpFoldersFormat[seeDataDepartment?.department || ""]}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-left col-span-1">
                  Telefone
                </Label>
                <div id="phone" className="col-span-3 text-left">
                  {seeDataDepartment?.phone || "Não informado"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-left col-span-1">
                  Pastas com Acesso
                </Label>
                <div id="folders" className="col-span-3 text-left">
                  {seeDataDepartment?.foldersAccess.map(
                    (folder) => `${folderFormat[folder.foldername]}, `
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-left col-span-1">
                  Texto para enviar no email
                </Label>
                <div id="folders" className="col-span-3 text-left">
                  {seeDataDepartment?.emailTemplate}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteClientOpen}
        onClose={() => setIsDeleteClientOpen(false)}
        onConfirm={confirmDeleteClient}
        title="Confirmar Exclusão de Usuário"
        description="Tem certeza que deseja excluir este cliente? Esta ação não pode
              ser desfeita."
        warningMessage=" Todos os dados associados a este cliente serão removidos."
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDepartmentOpen}
        onClose={() => setIsDeleteDepartmentOpen(false)}
        onConfirm={confirmDeleteDepartment}
        title="Confirmar Exclusão de Departamento"
        description="Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita."
        warningMessage="Todos os logs e dados associados serão removidos."
      />

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
                    {foldersToAcess.all.map((folder) => (
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

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2023 Nome da Departamento. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
