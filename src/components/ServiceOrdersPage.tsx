import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { OsService } from "@/services/OsService";
import useAuth from "@/security/UseAuth";

// Mantém a interface para o Filtro
interface Filters {
  type: "page" | "training" | "os";
  status: string; // "pending", "scheduled", ...
  startDate: string;
  endDate: string;
  client: string;
  orderNumber: string;
  store: string; // NOVO
  seller: string; // NOVO
}

// Interface do formato dos dados (ServiceOrder)
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
}

interface ServiceOrdersPageProps {
  filtersProp: Filters;
  ordersProp: Order[];
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
}: ServiceOrdersPageProps) {
  const { token } = useAuth();

  // Armazena os filtros iniciais que vieram por props
  const [filters, setFilters] = useState<Filters>(filtersProp);

  // Armazena as ordens já filtradas para exibir na tabela
  const [orders, setOrders] = useState<Order[]>(ordersProp);

  // -- Modais e edição/visualização
  // Modal de edição
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newType, setNewType] = useState("" as "page" | "training" | "os");

  // Modal de visualização
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Sincroniza filtersProp -> filters local
  useEffect(() => {
    setFilters(filtersProp);
  }, [filtersProp]);

  // Sempre que "filters" mudar, refaz a busca
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    //espera 0.3 seg e atualiza os dados na montagem inicial
    setTimeout(() => {
      handleSearch();
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se ordersProp mudar externamente, atualiza local
  useEffect(() => {
    setOrders(ordersProp);
  }, [ordersProp]);

  //envia para outra aba
  const handleOpenDocument = (hash: string) => {
    window.open(`https://gestaoclick.com/os/${hash}`, "_blank");
  };

  // Atualiza estado dos filtros conforme o usuário digita / seleciona
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  // Filtragem local usando "filters" (o state local)
  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();

    let filteredData = [...ordersProp];

    // 1) Filtro por type
    if (filters.type && filters.type !== "os") {
      filteredData = filteredData.filter((o) => o.type === filters.type);
    }

    // 2) Filtro por status
    if (filters.status) {
      filteredData = filteredData.filter((o) => o.status === filters.status);
    }

    // 3) Filtro por data inicial
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      filteredData = filteredData.filter(
        (o) => new Date(o.entryDate).getTime() >= start
      );
    }

    // 4) Filtro por data final
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      filteredData = filteredData.filter(
        (o) => new Date(o.exitDate).getTime() <= end
      );
    }

    // 5) Filtro por cliente (nome ou ID)
    if (filters.client) {
      filteredData = filteredData.filter(
        (o) =>
          o.clientName.toLowerCase().includes(filters.client.toLowerCase()) ||
          o.clientId.toLowerCase().includes(filters.client.toLowerCase())
      );
    }

    // 6) Filtro por número da O.S
    if (filters.orderNumber) {
      filteredData = filteredData.filter(
        (o) => o.id === Number(filters.orderNumber)
      );
    }

    // 7) Filtro por LOJA
    if (filters.store) {
      filteredData = filteredData.filter(
        (o) =>
          o.storeName &&
          o.storeName.toLowerCase().includes(filters.store.toLowerCase())
      );
    }

    // 8) Filtro por VENDEDOR
    if (filters.seller) {
      filteredData = filteredData.filter(
        (o) =>
          o.sellerName &&
          o.sellerName.toLowerCase().includes(filters.seller.toLowerCase())
      );
    }

    setOrders(filteredData);
  };

  // Clique para EDITAR (abrir modal)
  const handleEditClick = (order: Order) => {
    setEditingOrder(order);

    // carrega status e type atuais
    setNewStatus(order.status);
    setNewType(order.type);
  };

  // Salva o novo status e type no array local (chamando API)
  const handleSaveChanges = () => {
    if (!editingOrder) return;

    const updatedOrders = orders.map((o) => {
      if (o.id === editingOrder.id) {
        // Chamada de serviço para atualizar
        OsService.updateOs(token!, {
          ...o,
          status: newStatus,
          type: newType,
        });

        // Retorna o objeto atualizado
        return { ...o, status: newStatus, type: newType };
      }
      return o;
    });

    setOrders(updatedOrders);
    setEditingOrder(null);
  };

  // Fecha modal de edição sem salvar
  const handleCloseEditModal = () => {
    setEditingOrder(null);
  };

  // Clique para VISUALIZAR (abrir modal)
  const handleViewClick = (order: Order) => {
    setViewingOrder(order);
  };

  // Fecha modal de visualização
  const handleCloseViewModal = () => {
    setViewingOrder(null);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar com filtros */}
      <div className="w-64 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <form onSubmit={handleSearch}>
          <div className="space-y-4">
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
                title="Selecione o tipo (Laudo ou Treinamento)"
              >
                <option value="">Todos</option>
                <option value="page">Laudo</option>
                <option value="training">Treinamento</option>
              </select>
            </div>

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
                title="Selecione o status"
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
                title="Selecione a data inicial"
              />
            </div>

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
                title="Selecione a data final"
              />
            </div>

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
                placeholder="Digite o nome do cliente"
                title="Informe o nome do cliente"
              />
            </div>

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
                placeholder="Digite o número da ordem de serviço"
                title="Informe o número da O.S"
              />
            </div>

            {/* NOVO: Filtro por loja */}
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
                title="Informe a loja"
              />
            </div>

            {/* NOVO: Filtro por Vendedor */}
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
                title="Informe o nome do vendedor"
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
                <tr key={order.id}>
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
                  <td className="py-2 px-4 border">{order.services[0].name}</td>
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
                        className="p-1 bg-yellow-500 text-white rounded hover:bg-orange-600"
                        onClick={() => handleOpenDocument(order.hash)}
                      >
                        <span role="img" aria-label="Editar OS">
                          📁
                        </span>
                      </button>
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
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCloseEditModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveChanges}
              >
                Salvar
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
                <strong>Loja:</strong> {viewingOrder.storeName ?? "N/A"}
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
