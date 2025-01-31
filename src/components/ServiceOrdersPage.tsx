import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { OsService } from "@/services/OsService";
import useAuth from "@/security/UseAuth";
import { UserService } from "@/services/UserService";
import { DocumentService } from "@/services/DocumentService";

// Mantém a interface para o Filtro
interface Filters {
  type: "page" | "training" | "os";
  status: string;
  startDate: string;
  endDate: string;
  client: string;
  orderNumber: string;
  store: string;
  seller: string;
  serviceName: string; // NOVO
}

// Interface para cada serviço associado à ordem
interface ServiceDataService {
  id: number;
  cod: string;
  name: string;
  sellValue: string;
  description: string;
  duration: string | null;
}

// Interface do formato das ordens
interface Order {
  id: number;
  cod: string;
  status: string;
  clientName: string;
  clientId: string;
  sellerId: string;
  sellerName: string;
  technicalId: string;
  technicalName: string;
  entryDate: string;
  exitDate: string;
  situationName: string;
  totalValue: string;
  storeName: string;
  created_at: string;
  updated_at: string;
  type: "page" | "training" | "os";
  services: ServiceDataService[];
  local?: string;
  scheduledDate?: string;
  documentId?: string;
}

interface ServiceOrdersPageProps {
  filtersProp: Filters;
  ordersProp: Order[];
  servicesProp: ServiceDataService[];
}

// Mapeamento: Valor interno (status) -> Texto exibido
const statusCodeToView: Record<string, string> = {
  pending: "PENDENTE",
  contacting_client: "EM CONTATO COM CLIENTE",
  to_schedule: "P/ AGENDAR",
  scheduled: "AGENDADO",
  no_technical_visit: "S/ VISITA TECNICA",
  in_development: "EM ELABORAÇÃO",
  waiting_signature: "AGUARDANDO ASSINATURA",
  done_delivered: "PRONTO E ENTREGUE",
};

// Mapeamento de type -> texto exibido
const typeCodeToView: Record<string, string> = {
  page: "Laudo",
  training: "Treinamento",
};

export function ServiceOrdersPage({
  filtersProp,
  ordersProp,
  servicesProp,
}: ServiceOrdersPageProps) {
  const { token } = useAuth();

  // Armazena os filtros iniciais
  const [filters, setFilters] = useState<Filters>(filtersProp);

  // Armazena as ordens já filtradas para exibir na tabela
  const [orders, setOrders] = useState<Order[]>(ordersProp);

  // Modal de edição
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newType, setNewType] = useState<"page" | "training" | "os">("page");
  const [atrasados, setAtrasados] = useState(
    ordersProp.filter((o) => {
      const entryTime = new Date(o.entryDate).getTime();
      const now = Date.now();

      return servicesProp.some((service) => {
        if (o.services[0].name !== service.name || !service.duration)
          return false;

        const prazo = entryTime + Number(service.duration) * 86400000;
        return now > prazo && o.status !== "scheduled";
      });
    })
  );
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleLocation, setScheduleLocation] = useState("");
  const [scheduleClientConfirmed, setScheduleClientConfirmed] = useState(false);

  const [isAttachmentModalVisible, setIsAttachmentModalVisible] =
    useState(false);
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);

  // Modal de visualização
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Sincroniza filtersProp -> filters local
  useEffect(() => {
    setFilters(filtersProp);
  }, [filtersProp]);

  // Recalcula busca ao mudar "filters"
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Montagem inicial
  useEffect(() => {
    setTimeout(() => {
      handleSearch();
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se ordersProp mudar externamente, atualiza local
  useEffect(() => {
    setOrders(ordersProp);
  }, [ordersProp]);

  // Atualiza state de filtros conforme o usuário digita
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  // Filtragem local
  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();

    let filteredData = [...ordersProp];

    if (filters.type === "late") {
      filteredData = filteredData.filter((o) => {
        const entryTime = new Date(o.entryDate).getTime();
        const now = Date.now();

        return servicesProp.some((service) => {
          if (o.services[0].name !== service.name || !service.duration)
            return false;

          const prazo = entryTime + Number(service.duration) * 86400000;
          return now > prazo && o.status !== "scheduled";
        });
      });
    }
    // Filtro por type
    if (filters.type && filters.type !== "os" && filters.type !== "late") {
      filteredData = filteredData.filter((o) => o.type === filters.type);
    } else if (filters.type === "os") {
      // "os" significa "page" OU "training"
      filteredData = filteredData.filter(
        (o) => o.type === "page" || o.type === "training"
      );
    }
    // Filtro por status
    if (filters.status) {
      filteredData = filteredData.filter((o) => o.status === filters.status);
    }

    // Filtro por data inicial
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      filteredData = filteredData.filter(
        (o) => new Date(o.entryDate).getTime() >= start
      );
    }

    // Filtro por data final
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      filteredData = filteredData.filter(
        (o) => new Date(o.exitDate).getTime() <= end
      );
    }

    // Filtro por cliente (nome ou ID)
    if (filters.client) {
      filteredData = filteredData.filter(
        (o) =>
          o.clientName.toLowerCase().includes(filters.client.toLowerCase()) ||
          o.clientId.toLowerCase().includes(filters.client.toLowerCase())
      );
    }

    // Filtro por número da O.S
    if (filters.orderNumber) {
      filteredData = filteredData.filter(
        (o) => o.id === Number(filters.orderNumber)
      );
    }

    // Filtro por LOJA
    if (filters.store) {
      filteredData = filteredData.filter(
        (o) =>
          o.storeName &&
          o.storeName.toLowerCase().includes(filters.store.toLowerCase())
      );
    }

    // Filtro por VENDEDOR
    if (filters.seller) {
      filteredData = filteredData.filter(
        (o) =>
          o.sellerName &&
          o.sellerName.toLowerCase().includes(filters.seller.toLowerCase())
      );
    }

    // NOVO: Filtro por nome do serviço
    if (filters.serviceName) {
      filteredData = filteredData.filter((o) =>
        o.services?.some((srv) =>
          srv.name.toLowerCase().includes(filters.serviceName.toLowerCase())
        )
      );
    }

    setOrders(filteredData);
  };

  // Clique para VISUALIZAR (abrir modal)
  const handleViewClick = (order: Order) => {
    setViewingOrder(order);
  };

  // Fecha modal de visualização
  const handleCloseViewModal = () => {
    setViewingOrder(null);
  };

  // Clique para EDITAR (abrir modal)
  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setNewType(order.type);
  };

  // Fecha modal de edição
  const handleCloseEditModal = () => {
    setEditingOrder(null);
  };

  // Salva as mudanças (status/type)
  const handleSaveChanges = () => {
    if (!editingOrder) return;

    // Se for "scheduled", abrimos o modal de agendamento

    if (newStatus === "done_delivered") {
      // Abre modal de anexo
      setIsAttachmentModalVisible(true);
      return;
    }

    if (newStatus === "scheduled") {
      // Limpamos campos do agendamento (ou preenche com defaults)
      setScheduleDate("");
      setScheduleLocation("");
      setScheduleClientConfirmed(false);

      // Abrimos o modal de agendamento
      setScheduleModalVisible(true);
      return;
    }

    // Caso contrário, salva normal
    doUpdateOs(editingOrder, newStatus, newType);
  };

  // Modal de anexo
  const handleCloseAttachmentModal = () => {
    setIsAttachmentModalVisible(false);
    setNewDocumentFile(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewDocumentFile(e.target.files[0]);
  };

  const handleAttachFile = async (cod: string) => {
    if (!newDocumentFile) {
      alert("Selecione um arquivo antes de concluir!");
      return;
    }

    const newDocumentId = await handleAddDocument(cod);

    editingOrder!.documentId = newDocumentId;

    doUpdateOs(editingOrder!, "done_delivered", newType);

    handleCloseAttachmentModal();
    handleCloseEditModal();
  };

  function doUpdateOs(
    order: Order,
    status: string,
    type: "page" | "training" | "os"
  ) {
    const updatedOrders = orders.map((o) => {
      if (o.id === order.id) {
        OsService.updateOs(token!, { ...o, status, type });
        return { ...o, status, type };
      }
      return o;
    });
    setOrders(updatedOrders);
  }

  const handleSaveSchedule = () => {
    console.log(editingOrder);
    if (!editingOrder) {
      // Em tese, deve estar guardado de antes
      console.log("saiu");
      return setScheduleModalVisible(false);
    }
    // FAZ alguma lógica extra:
    // - Salvar data, local e confirm no backend (seu endpoint),
    //   ou armazenar na OS, ou outro local
    // Exemplo fictício:
    console.log(
      "Agendamento:",
      scheduleDate,
      scheduleLocation,
      scheduleClientConfirmed
    );

    editingOrder.scheduledDate = scheduleDate;
    editingOrder.local = scheduleLocation;

    // 1) Atualiza a OS com status = "scheduled"
    doUpdateOs(editingOrder, "scheduled", newType);

    // 2) Fecha o modal de agendamento
    setScheduleModalVisible(false);
  };

  // Fecha modal de agendamento sem salvar
  const handleCloseScheduleModal = () => {
    setScheduleModalVisible(false);
  };

  const handleDownload = async (id: number, fileName: string, cod: string) => {
    try {
      if (!token) {
        alert("Usuário não autenticado.");
        return;
      }

      const user = await UserService.findUserByCod(token!, cod);

      const response = await DocumentService.downloadFile(token, id, user.id);
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

  const handleAddDocument = async (cod: string) => {
    const user = await UserService.findUserByCod(token!, cod);

    if (!newDocumentFile) {
      alert("Por favor, preencha todos os campos e selecione um cliente.");
      return;
    }

    const formData = new FormData();
    formData.append("document", newDocumentFile);
    formData.append("name", "Ordem de Serviço");
    formData.append("folder", "ordensServico");
    formData.append("description", `Arquivo Ordem de Serviço`);

    try {
      if (!token || !user) {
        alert("Token ou cliente não encontrado");
        return;
      }

      const documentId = await DocumentService.uploadFile2(
        token,
        user.id,
        formData
      );
      setNewDocumentFile(null);
      return documentId;
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      alert("Erro ao fazer upload do arquivo.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar com filtros */}
      <div className="w-64 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <form onSubmit={handleSearch}>
          <div className="space-y-4">
            {/* TYPE */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Todos</option>
                <option value="os">O.S (Laudos + Treinamentos)</option>
                <option value="page">Laudo</option>
                <option value="training">Treinamento</option>
                <option value="late">Atrasados</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Todos</option>
                <option value="pending">PENDENTE</option>
                <option value="contacting_client">
                  EM CONTATO COM CLIENTE
                </option>
                <option value="to_schedule">P/ AGENDAR</option>
                <option value="scheduled">AGENDADO</option>
                <option value="no_technical_visit">S/ VISITA TECNICA</option>
                <option value="in_development">EM ELABORAÇÃO</option>
                <option value="waiting_signature">AGUARDANDO ASSINATURA</option>
                <option value="done_delivered">PRONTO E ENTREGUE</option>
              </select>
            </div>

            {/* DATA INICIAL */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Data Inicial
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* DATA FINAL */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Data Final
              </label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* CLIENTE */}
            <div>
              <label
                htmlFor="client"
                className="block text-sm font-medium text-gray-700"
              >
                Cliente
              </label>
              <input
                id="client"
                type="text"
                name="client"
                value={filters.client}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Nome ou ID do cliente"
              />
            </div>

            {/* ORDER NUMBER */}
            <div>
              <label
                htmlFor="orderNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Número da O.S
              </label>
              <input
                id="orderNumber"
                type="text"
                name="orderNumber"
                value={filters.orderNumber}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="ID da OS"
              />
            </div>

            {/* LOJA */}
            <div>
              <label
                htmlFor="store"
                className="block text-sm font-medium text-gray-700"
              >
                Loja
              </label>
              <input
                id="store"
                type="text"
                name="store"
                value={filters.store}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Nome da loja"
              />
            </div>

            {/* VENDEDOR */}
            <div>
              <label
                htmlFor="seller"
                className="block text-sm font-medium text-gray-700"
              >
                Vendedor
              </label>
              <input
                id="seller"
                type="text"
                name="seller"
                value={filters.seller}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Nome do vendedor"
              />
            </div>

            {/* NOVO: NOME DO SERVIÇO */}
            <div>
              <label
                htmlFor="serviceName"
                className="block text-sm font-medium text-gray-700"
              >
                Serviço
              </label>
              <input
                id="serviceName"
                type="text"
                name="serviceName"
                value={filters.serviceName}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Nome do serviço"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b">
          <SearchIcon />
          <h1 className="text-lg">Ordens de serviços</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Início</span>
            <span className="text-gray-400">•</span>
            <span className="hover:text-gray-900 cursor-pointer">
              Ordens de serviços
            </span>
            <span className="text-gray-400">•</span>
            <span className="hover:text-gray-900 cursor-pointer">Listar</span>
          </div>
        </div>

        {/* Tabela */}
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4 border">N°</th>
                <th className="py-2 px-4 border">Cliente</th>
                <th className="py-2 px-4 border">Entrada</th>
                <th className="py-2 px-4 border">Saída</th>
                <th className="py-2 px-4 border">Tipo</th>
                <th className="py-2 px-4 border">Situação</th>
                <th className="py-2 px-4 border">Loja</th>
                <th className="py-2 px-4 border">Serviço</th>
                <th className="py-2 px-4 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={
                    `${
                      atrasados.some((a) => a.id === order.id)
                        ? "bg-yellow-100"
                        : ""
                    }` +
                    ` ${
                      order.status === "done_delivered" ? "bg-green-100" : ""
                    }`
                  }
                >
                  <td className="py-2 px-4 border">{order.id}</td>
                  <td className="py-2 px-4 border">
                    <div>
                      <div className="font-medium">{order.clientName}</div>
                      <div className="text-gray-500">({order.clientId})</div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(order.entryDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-4 border">
                    {order.exitDate
                      ? new Date(order.exitDate).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border">
                    {typeCodeToView[order.type] ?? order.type}
                  </td>
                  <td className="py-2 px-4 border">
                    <span className="inline-block px-2 py-1 bg-gray-200 rounded text-sm">
                      {statusCodeToView[order.status] ?? order.status}
                    </span>
                  </td>

                  <td className="py-2 px-4 border">{order.storeName}</td>
                  {/* Exemplo exibindo apenas o primeiro serviço ou todos */}
                  <td className="py-2 px-4 border">
                    {order.services && order.services.length > 0
                      ? order.services.map((srv) => srv.name).join(", ")
                      : "N/A"}
                  </td>

                  <td className="py-2 px-4 border">
                    <div className="flex gap-1">
                      {/* BOTÃO LUPA: visualizar detalhes */}
                      <button
                        className="p-1 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                        onClick={() => handleViewClick(order)}
                      >
                        <span role="img" aria-label="Ver detalhes">
                          🔍
                        </span>
                      </button>
                      {/* BOTÃO EDITAR: abre modal de edição */}
                      <button
                        className="p-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                        onClick={() => handleEditClick(order)}
                      >
                        <span role="img" aria-label="Editar OS">
                          ✏️
                        </span>
                      </button>
                      <button
                        className="p-1 bg-yellow-500 text-white rounded hover:bg-orange-400"
                        onClick={() => {
                          window.open(
                            `https://gestaoclick.com/os/${order.hash}`
                          );
                        }}
                      >
                        <span role="img" aria-label="Ver arquivo">
                          📁
                        </span>
                      </button>
                      {order.documentId && (
                        <button
                          className="p-1 bg-green-400 text-white rounded hover:bg-green-600"
                          onClick={() =>
                            handleDownload(
                              +order.documentId!,
                              "OS - PRONTO " + order.clientName,
                              order.clientId!
                            )
                          }
                        >
                          <span role="img" aria-label="Ver arquivo">
                            📁
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-sm text-gray-500">
            Mostrando {orders.length} de {orders.length} resultados
          </div>
        </div>
      </div>

      {/* Modal de EDIÇÃO (se há alguma ordem selecionada) */}
      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">
              Editar O.S #{editingOrder.id}
            </h2>

            {/* SELECIONAR O TIPO (Laudo / Treinamento) */}
            <div className="mb-4">
              <label
                htmlFor="newType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo
              </label>
              <select
                id="newType"
                className="w-full border border-gray-300 rounded-md p-2 mb-2"
                value={newType}
                onChange={(e) =>
                  setNewType(e.target.value as "page" | "training" | "os")
                }
              >
                <option value="page">Laudo</option>
                <option value="training">Treinamento</option>
              </select>
            </div>

            {/* SELECIONAR O STATUS */}
            <div className="mb-4">
              <label
                htmlFor="newStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="newStatus"
                className="w-full border border-gray-300 rounded-md p-2"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">PENDENTE</option>
                <option value="contacting_client">
                  EM CONTATO COM CLIENTE
                </option>
                <option value="to_schedule">P/ AGENDAR</option>
                <option value="scheduled">AGENDADO</option>
                <option value="no_technical_visit">S/ VISITA TECNICA</option>
                <option value="in_development">EM ELABORAÇÃO</option>
                <option value="waiting_signature">AGUARDANDO ASSINATURA</option>
                <option value="done_delivered">PRONTO E ENTREGUE</option>
              </select>
            </div>

            {/* BOTÕES SALVAR E CANCELAR */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCloseEditModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveChanges}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {scheduleModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Agendar O.S</h2>

            {/* Data do agendamento */}
            <div className="mb-4">
              <label
                htmlFor="scheduleDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Data do Agendamento
              </label>
              <input
                id="scheduleDate"
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>

            {/* Local do agendamento */}
            <div className="mb-4">
              <label
                htmlFor="scheduleLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Local
              </label>
              <input
                id="scheduleLocation"
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                value={scheduleLocation}
                onChange={(e) => setScheduleLocation(e.target.value)}
                placeholder="Local do agendamento"
              />
            </div>

            {/* Confirmação de cliente */
            /*  <div className="mb-4 flex items-center">
              <input
                id="scheduleClientConfirmed"
                type="checkbox"
                className="mr-2"
                checked={scheduleClientConfirmed}
                onChange={(e) => setScheduleClientConfirmed(e.target.checked)}
              />
              <label
                htmlFor="scheduleClientConfirmed"
                className="text-sm text-gray-700"
              >
                Cliente Confirmado?
              </label>
            </div>*/}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCloseScheduleModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleSaveSchedule}
              >
                Salvar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {isAttachmentModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Anexar Arquivo</h2>
            <div className="mb-4 space-y-2">
              <label
                htmlFor="attachment"
                className="block text-sm font-medium text-gray-700"
              >
                Selecione um arquivo
              </label>
              <input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCloseAttachmentModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleAttachFile(editingOrder?.clientId!)}
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de VISUALIZAÇÃO (se há alguma ordem selecionada) */}
      {viewingOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Detalhes da O.S #{viewingOrder.id}
            </h2>

            <div className="space-y-2 text-sm">
              <div>
                <strong>ID:</strong> {viewingOrder.id ?? "N/A"}
              </div>
              <div>
                <strong>Cod:</strong> {viewingOrder.cod ?? "N/A"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {statusCodeToView[viewingOrder.status] ?? viewingOrder.status}
              </div>
              <div>
                <strong>Tipo:</strong>{" "}
                {typeCodeToView[viewingOrder.type] ?? viewingOrder.type}
              </div>
              <div>
                <strong>Cliente:</strong> {viewingOrder.clientName ?? "N/A"} (
                {viewingOrder.clientId ?? "N/A"})
              </div>
              <div>
                <strong>Vendedor:</strong> {viewingOrder.sellerName ?? "N/A"} (
                {viewingOrder.sellerId ?? "N/A"})
              </div>
              <div>
                <strong>Técnico:</strong> {viewingOrder.technicalName ?? "N/A"}{" "}
                ({viewingOrder.technicalId ?? "N/A"})
              </div>
              <div>
                <strong>Data de Entrada:</strong>{" "}
                {viewingOrder.entryDate
                  ? new Date(viewingOrder.entryDate).toLocaleDateString("pt-BR")
                  : "N/A"}
              </div>
              <div>
                <strong>Data de Saída:</strong>{" "}
                {viewingOrder.exitDate
                  ? new Date(viewingOrder.exitDate).toLocaleDateString("pt-BR")
                  : "N/A"}
              </div>
              <div>
                <strong>Situação:</strong> {viewingOrder.situationName ?? "N/A"}
              </div>
              <div>
                <strong>Local:</strong> {viewingOrder.local ?? "N/A"}
              </div>
              <div>
                <strong>Data de Agendamento:</strong>{" "}
                {viewingOrder.scheduledDate
                  ? new Date(viewingOrder.scheduledDate).toLocaleDateString(
                      "pt-BR"
                    )
                  : "N/A"}
              </div>
              <div>
                <strong>DocumentId:</strong> {viewingOrder.documentId ?? "N/A"}
              </div>
              <div>
                <strong>Loja:</strong> {viewingOrder.storeName ?? "N/A"}
              </div>
              <div>
                <strong>Serviços:</strong>{" "}
                {viewingOrder.services && viewingOrder.services.length > 0
                  ? viewingOrder.services.map((srv) => srv.name).join(", ")
                  : "N/A"}
              </div>
              <div>
                <strong>Criado em:</strong>{" "}
                {viewingOrder.created_at
                  ? new Date(viewingOrder.created_at).toLocaleString("pt-BR")
                  : "N/A"}
              </div>
              <div>
                <strong>Atualizado em:</strong>{" "}
                {viewingOrder.updated_at
                  ? new Date(viewingOrder.updated_at).toLocaleString("pt-BR")
                  : "N/A"}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCloseViewModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
