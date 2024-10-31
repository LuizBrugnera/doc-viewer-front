"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Search,
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
import {
  Department,
  Document,
  ResponseUpload,
  User,
} from "@/types/GlobalTypes";
import useAuth from "@/security/UseAuth";
import { UserService } from "@/services/UserService";
import {
  folderFormat,
  foldersToAcess,
  folderUpFoldersFormat,
  formatMySqlToBrDate,
  stateFormat,
} from "../utils";
import FolderSistemToUpload from "../FolderSistemToUpload";
import { ScrollArea } from "../ui/scroll-area";
import { UserManagement } from "../UserManagement";
import { DocumentService } from "@/services/DocumentService";
import { DepartmentService } from "@/services/DepartmentService";
import { Checkbox } from "../ui/checkbox";
import { AuthService } from "@/services/AuthService";

type AddDepartmentForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  department: string; //"financeiro" | "documentosTecnicos" | "faturamento" | "esocial";
  foldersAccess: { foldername: string }[];
};

type UpdateDepartmentForm = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  department: string; //"financeiro" | "documentosTecnicos" | "faturamento" | "esocial";
  foldersAccess: { foldername: string }[];
};

type UpdateUserForm = {
  id: number;
  name: string;
  mainEmail: string;
  cod: string;
  phone: string;
  password: string;
  confirmPassword: string;
  cnpj: string;
  rg: string;
};

export default function AdminHomePage() {
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
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<UpdateDepartmentForm | null>({
      id: 0,
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      department: "",
      foldersAccess: [],
    });
  const [editingClient, setEditingClient] = useState<UpdateUserForm | null>(
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
  const [addDepartmentForm, setAddDepartmentForm] =
    useState<AddDepartmentForm | null>({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      department: "financeiro",
      foldersAccess: [],
    });

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

  function extractId(text: string) {
    const match = text.match(/\{(\d+)\}/);
    return match ? parseInt(match[1], 10) : null;
  }
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

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (addDepartmentForm) {
      if (addDepartmentForm.password !== addDepartmentForm.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      const data = {
        name: addDepartmentForm.name,
        email: addDepartmentForm.email,
        phone: addDepartmentForm.phone,
        password: addDepartmentForm.password,
        department: addDepartmentForm.department,
        foldersAccess: addDepartmentForm.foldersAccess,
      };

      if (!token) {
        alert("Token expirado! Logue novamente.");
        return;
      }
      await AuthService.register.department(data, token);
      await fetchDepartments();

      setAddDepartmentForm(null);
      setIsAddDepartmentOpen(false);
    }
    setIsAddDepartmentOpen(false);
  };

  useEffect(() => {
    if (addDepartmentForm?.department) {
      const defaultFolders = foldersToAcess[addDepartmentForm.department] || [];
      setAddDepartmentForm((prev) =>
        prev
          ? {
              ...prev,
              foldersAccess: defaultFolders.map((folder) => ({
                foldername: folder,
              })),
            }
          : null
      );
    }
  }, [addDepartmentForm?.department]);

  const handleFolderChange = (folder: string, checked: boolean) => {
    setAddDepartmentForm((prev) =>
      prev
        ? {
            ...prev,
            foldersAccess: checked
              ? [...prev.foldersAccess, { foldername: folder }]
              : prev.foldersAccess.filter((f) => f.foldername !== folder),
          }
        : null
    );
  };

  const handleFolderChangeUpdate = (folder: string, checked: boolean) => {
    setEditingDepartment((prev) =>
      prev
        ? {
            ...prev,
            foldersAccess: checked
              ? [...prev.foldersAccess, { foldername: folder }]
              : prev.foldersAccess.filter((f) => f.foldername !== folder),
          }
        : null
    );
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment({
      id: +department.id,
      name: department.name,
      email: department.email,
      phone: department.phone || "",
      password: "",
      confirmPassword: "",
      department: department.department,
      foldersAccess: department.foldersAccess,
    });
    setIsEditDepartmentOpen(true);
  };

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDepartment) {
      if (editingDepartment.password !== editingDepartment.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      const data = {
        id: editingDepartment.id,
        name: editingDepartment.name,
        email: editingDepartment.email,
        password: editingDepartment.password,
        department: editingDepartment.department,
        phone: editingDepartment.phone,
        role: "department",
        foldersAccess: editingDepartment.foldersAccess,
      };

      if (!token) {
        alert("Token expirado! Logue novamente.");
        return;
      }
      await DepartmentService.updateDepartment(token, data);

      await fetchDepartments();

      setEditingDepartment(null);
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
      id: editingClient.id,
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ação</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data e Hora</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDepartment.logs
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
                                    {/* Linha em branco entre os dias */}
                                    <TableRow>
                                      <TableCell
                                        colSpan={3}
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
                                    {log.state ? log.state : "Sucesso!"}
                                  </TableCell>
                                  <TableCell>
                                    {formatMySqlToBrDate(log.date)}
                                  </TableCell>
                                  <TableCell>{log.description}</TableCell>
                                </TableRow>
                              </Fragment>
                            );
                          })}
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
                        userInfo.adminLogs &&
                        userInfo!.adminLogs
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
                                      <Fragment>
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
                                      </Fragment>
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

      {/* Add User Dialog */}
      <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Departamento</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo departamento.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDepartment}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departmentName">Nome do Departamento*</Label>
                <Input
                  id="departmentName"
                  placeholder="Digite o nome do departamento"
                  required
                  value={addDepartmentForm?.name || ""}
                  onChange={(e) =>
                    setAddDepartmentForm(
                      addDepartmentForm
                        ? { ...addDepartmentForm, name: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentEmail">Email do Departamento*</Label>
                <Input
                  id="departmentEmail"
                  type="email"
                  placeholder="departamento@example.com"
                  required
                  value={addDepartmentForm?.email || ""}
                  onChange={(e) =>
                    setAddDepartmentForm(
                      addDepartmentForm
                        ? { ...addDepartmentForm, email: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentPhone">
                  Telefone do Departamento
                </Label>
                <Input
                  id="departmentPhone"
                  type="text"
                  placeholder="(99) 999999999 OPCIONAL"
                  value={addDepartmentForm?.phone || ""}
                  onChange={(e) =>
                    setAddDepartmentForm(
                      addDepartmentForm
                        ? { ...addDepartmentForm, phone: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentDepartment">Departamento*</Label>
                <select
                  id="departmentDepartment"
                  value={addDepartmentForm?.department || ""}
                  onChange={(e) =>
                    setAddDepartmentForm(
                      addDepartmentForm
                        ? { ...addDepartmentForm, department: e.target.value }
                        : null
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="financeiro">Financeiro</option>
                  <option value="documentosTecnicos">
                    Documentos Técnicos
                  </option>
                  <option value="faturamento">Faturamento</option>
                  <option value="esocial">E-social</option>
                  <option value="vendas">Vendas</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Pastas com Acesso</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(folderFormat).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`folder-${key}`}
                        checked={
                          addDepartmentForm?.foldersAccess?.some(
                            (folder) => folder.foldername === key
                          ) || false
                        }
                        onCheckedChange={(checked) =>
                          handleFolderChange(key, checked as boolean)
                        }
                      />
                      <Label htmlFor={`folder-${key}`}>{value}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentPassword">
                  Senha do Departamento*
                </Label>
                <Input
                  id="departmentPassword"
                  type="password"
                  placeholder="********"
                  required
                  value={addDepartmentForm?.password || ""}
                  onChange={(e) =>
                    setAddDepartmentForm(
                      addDepartmentForm
                        ? { ...addDepartmentForm, password: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentConfirmPassword">
                  Confirme a Senha do Departamento*
                </Label>
                <Input
                  id="departmentConfirmPassword"
                  type="password"
                  placeholder="********"
                  required
                  value={addDepartmentForm?.confirmPassword || ""}
                  onChange={(e) =>
                    setAddDepartmentForm(
                      addDepartmentForm
                        ? {
                            ...addDepartmentForm,
                            confirmPassword: e.target.value,
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Adicionar Departamento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditDepartmentOpen}
        onOpenChange={setIsEditDepartmentOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Departamento</DialogTitle>
            <DialogDescription>
              Atualize as informações da empresa.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDepartment}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editDepartmentName">Nome da Departamento</Label>
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
                <Label htmlFor="editDepartmentEmail">
                  Email da Departamento
                </Label>
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

                <div className="space-y-2">
                  <Label htmlFor="editDepartmentPhone">
                    Telefone da Departamento
                  </Label>
                  <Input
                    id="editDepartmentPhone"
                    type="text"
                    placeholder="(99) 999999999 OPCIONAL"
                    value={editingDepartment?.phone || ""}
                    onChange={(e) =>
                      setEditingDepartment(
                        editingDepartment
                          ? { ...editingDepartment, phone: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departmentDepartment">Departamento*</Label>
                  <select
                    id="departmentDepartment"
                    value={editingDepartment?.department || ""}
                    onChange={(e) =>
                      setEditingDepartment(
                        editingDepartment
                          ? { ...editingDepartment, department: e.target.value }
                          : null
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="financeiro">Financeiro</option>
                    <option value="documentosTecnicos">
                      Documentos Técnicos
                    </option>
                    <option value="faturamento">Faturamento</option>
                    <option value="esocial">E-social</option>
                    <option value="vendas">Vendas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Pastas com Acesso</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(folderFormat).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`folder-${key}`}
                          checked={
                            editingDepartment?.foldersAccess?.some(
                              (folder) => folder.foldername === key
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            return handleFolderChangeUpdate(
                              key,
                              checked as boolean
                            );
                          }}
                        />
                        <Label htmlFor={`folder-${key}`}>{value}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDepartmentPassword">
                    Senha da Departamento*
                  </Label>
                  <Input
                    id="editDepartmentPassword"
                    type="password"
                    placeholder="********"
                    value={editingDepartment?.password || ""}
                    onChange={(e) =>
                      setEditingDepartment(
                        editingDepartment
                          ? { ...editingDepartment, password: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDepartmentConfirmPassword">
                    Confirme a Senha da Departamento*
                  </Label>
                  <Input
                    id="editDepartmentConfirmPassword"
                    type="password"
                    placeholder="********"
                    value={editingDepartment?.confirmPassword || ""}
                    onChange={(e) =>
                      setEditingDepartment(
                        editingDepartment
                          ? {
                              ...editingDepartment,
                              confirmPassword: e.target.value,
                            }
                          : null
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Atualizar Departamento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo cliente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Usuário</Label>
                <Input
                  id="clientName"
                  placeholder="Digite o nome do cliente"
                  required
                  value={editingClient?.name || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, name: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email do Usuário</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="cliente@example.com"
                  required
                  value={editingClient?.mainEmail || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, mainEmail: e.target.value }
                        : null
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <Label htmlFor="editClientPhone">Telefone do Usuário</Label>
              <Input
                id="editClientPhone"
                type="text"
                placeholder="(99) 999999999 OPCIONAL"
                value={editingClient?.phone || ""}
                onChange={(e) =>
                  setEditingClient(
                    editingClient
                      ? { ...editingClient, phone: e.target.value }
                      : null
                  )
                }
              />
            </div>

            <div className="space-y-2 mt-2">
              <Label htmlFor="editClientRg">RG</Label>
              <Input
                id="editClientRg"
                placeholder="Digite o rg"
                value={editingClient?.rg || ""}
                onChange={(e) =>
                  setEditingClient(
                    editingClient
                      ? { ...editingClient, rg: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="editClientCnpj">CNPJ</Label>
              <Input
                id="editClientCnpj"
                placeholder="Digite o cnpj"
                value={editingClient?.cnpj || ""}
                onChange={(e) =>
                  setEditingClient(
                    editingClient
                      ? { ...editingClient, cnpj: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="editClientPassword">Senha</Label>
              <Input
                type="password"
                id="editClientPassword"
                placeholder="Digite a senha"
                value={editingClient?.password}
                onChange={(e) =>
                  setEditingClient(
                    editingClient
                      ? { ...editingClient, password: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="editClientConfirmPassword">
                Confirme a senha
              </Label>
              <Input
                type="password"
                id="editClientConfirmPassword"
                placeholder="Confirme a senha"
                value={editingClient?.confirmPassword}
                onChange={(e) =>
                  setEditingClient(
                    editingClient
                      ? { ...editingClient, confirmPassword: e.target.value }
                      : null
                  )
                }
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit">Adicionar Usuário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClient}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editClientName">Nome do Usuário</Label>
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
                <Label htmlFor="editClientEmail">Email do Usuário</Label>
                <Input
                  id="editClientEmail"
                  type="email"
                  placeholder="cliente@example.com"
                  value={editingClient?.mainEmail || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, mainEmail: e.target.value }
                        : null
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClientCnpj">CNPJ</Label>
                <Input
                  id="editClientCnpj"
                  placeholder="Digite o cnpj"
                  value={editingClient?.cnpj || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, cnpj: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClientRg">RG</Label>
                <Input
                  id="editClientRg"
                  placeholder="Digite o rg"
                  value={editingClient?.rg || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, rg: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClientPhone">Telefone</Label>
                <Input
                  id="editClientPhone"
                  placeholder="Digite o telefone"
                  value={editingClient?.phone || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, phone: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClientCod">COD</Label>
                <Input
                  id="editClientCod"
                  placeholder="Digite o cod"
                  value={editingClient?.cod || ""}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, cod: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClientPassword">Nova Senha</Label>
                <Input
                  type="password"
                  id="editClientPassword"
                  placeholder="Digite a nova senha"
                  value={editingClient?.password}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, password: e.target.value }
                        : null
                    )
                  }
                />
                <Label htmlFor="editClientConfirmPassword">
                  Confirme a nova senha
                </Label>
                <Input
                  type="password"
                  id="editClientConfirmPassword"
                  placeholder="Confirme a nova senha"
                  value={editingClient?.confirmPassword}
                  onChange={(e) =>
                    setEditingClient(
                      editingClient
                        ? { ...editingClient, confirmPassword: e.target.value }
                        : null
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Atualizar Usuário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={isDeleteDepartmentOpen}
        onOpenChange={setIsDeleteDepartmentOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão de Departamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta empresa? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-yellow-100 rounded-md">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <p className="text-yellow-700">
              Todos os logs e dados associados serão removidos.
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
              Excluir Departamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteClientOpen} onOpenChange={setIsDeleteClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão de Usuário</DialogTitle>
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
              Excluir Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
