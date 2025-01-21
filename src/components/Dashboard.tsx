import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import StatusCard from "./StatusCard";

// Texto amigável para cada status
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

interface Filters {
  type: string; // "os" (fictício), "page", "training"
  status: string;
  startDate: string;
  endDate: string;
  client: string;
  orderNumber: string;
}

// Model do seu ServiceOrder, com type = "page" ou "training"
interface ServiceOrder {
  id: number;
  cod: string;
  status: string;
  type: "page" | "training" | "os";
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
}

interface DashboardProps {
  onSelectStatus: (type: string, status: string) => void;
  ordersProp: ServiceOrder[];
}

// Vamos usar os mesmos statuses em todas as seções
// pois Laudos e Treinamentos têm os mesmos statuses.
const allStatuses = [
  "pending",
  "contacting_client",
  "to_schedule",
  "scheduled",
  "no_technical_visit",
  "in_development",
  "waiting_signature",
  "done_delivered",
];

export default function Dashboard({
  onSelectStatus,
  ordersProp,
}: DashboardProps) {
  // Filtros locais
  const [filters, setFilters] = useState<Filters>({
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    client: "",
    orderNumber: "",
  });

  // Contadores:
  // 1) "OS" → soma de (type="page" + type="training")
  const [countsOs, setCountsOs] = useState<Record<string, number>>({});
  // 2) Laudos (type="page")
  const [countsLaudos, setCountsLaudos] = useState<Record<string, number>>({});
  // 3) Treinamentos (type="training")
  const [countsTraining, setCountsTraining] = useState<Record<string, number>>(
    {}
  );

  // Sempre que ordersProp mudar, recalcule as contagens
  useEffect(() => {
    recalcAll(ordersProp);
  }, [ordersProp]);

  // Função que calcula os contadores
  function recalcAll(data: ServiceOrder[]) {
    // "OS" => soma (page + training)
    const newOsCounts: Record<string, number> = {};
    allStatuses.forEach((st) => {
      newOsCounts[st] = data.filter(
        (o) => (o.type === "page" || o.type === "training") && o.status === st
      ).length;
    });

    // Laudos (type="page")
    const newLaudosCounts: Record<string, number> = {};
    allStatuses.forEach((st) => {
      newLaudosCounts[st] = data.filter(
        (o) => o.type === "page" && o.status === st
      ).length;
    });

    // Treinamentos (type="training")
    const newTrainingCounts: Record<string, number> = {};
    allStatuses.forEach((st) => {
      newTrainingCounts[st] = data.filter(
        (o) => o.type === "training" && o.status === st
      ).length;
    });

    setCountsOs(newOsCounts);
    setCountsLaudos(newLaudosCounts);
    setCountsTraining(newTrainingCounts);
  }

  // Filtro local por datas, cliente etc. (opcional)
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    let filtered = [...ordersProp];

    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      filtered = filtered.filter(
        (o) => new Date(o.entryDate).getTime() >= start
      );
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      filtered = filtered.filter((o) => new Date(o.entryDate).getTime() <= end);
    }
    if (filters.client) {
      filtered = filtered.filter(
        (o) =>
          o.clientName.toLowerCase().includes(filters.client.toLowerCase()) ||
          o.clientId.toLowerCase().includes(filters.client.toLowerCase())
      );
    }
    if (filters.orderNumber) {
      filtered = filtered.filter((o) => o.cod.includes(filters.orderNumber));
    }

    // Recalcula contagens nesse subset
    recalcAll(filtered);
  };

  // Totais
  // 1) total "OS" (tudo que for page ou training)
  const totalOs = ordersProp.filter(
    (o) => o.type === "page" || o.type === "training"
  ).length;
  // 2) total Laudos

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Filter Sidebar */}
      <div className="w-64 bg-white p-4 border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <form onSubmit={handleSearch} className="space-y-4">
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
              <option value="page">Laudo</option>
              <option value="training">Treinamento</option>
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
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-8">
        {/* 1) SEÇÃO "STATUS DE O.S" => soma (page + training) */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            STATUS DE O.S (Laudos + Treinamentos)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Todos (page ou training) */}
            <StatusCard
              count={totalOs}
              label={"TODOS OS SERVIÇOS"}
              className="bg-blue-600 text-white"
              // Aqui "os" é um valor fictício que representará (page + training)
              // no ServiceOrdersPage, você interpretará type="os" como (type=page OR type=training).
              type="os"
              status=""
              onClick={onSelectStatus}
            />

            <StatusCard
              count={countsOs["contacting_client"] ?? 0}
              label={"EM ATRASO"}
              className="bg-red-700 text-white"
              type="os"
              status="contacting_client"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsOs["scheduled"] ?? 0}
              label={statusCodeToView["scheduled"]}
              className="bg-blue-400 text-white"
              type="os"
              status="scheduled"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsOs["done_delivered"] ?? 0}
              label={statusCodeToView["done_delivered"]}
              className="bg-green-800 text-white"
              type="os"
              status="done_delivered"
              onClick={onSelectStatus}
            />
          </div>
          {/* Se quiser mais statuses nessa seção, acrescente. */}
        </section>

        {/* 2) SEÇÃO "LAUDOS" => type="page" */}
        <section>
          <h2 className="text-xl font-bold mb-4">LAUDOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <StatusCard
              count={countsLaudos["pending"] ?? 0}
              label={statusCodeToView["pending"]}
              className="bg-yellow-400 text-gray-900"
              type="page"
              status="pending"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsLaudos["contacting_client"] ?? 0}
              label={statusCodeToView["contacting_client"]}
              className="bg-blue-200 text-gray-900"
              type="page"
              status="contacting_client"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsLaudos["to_schedule"] ?? 0}
              label={statusCodeToView["to_schedule"]}
              className="bg-blue-300 text-gray-900"
              type="page"
              status="to_schedule"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsLaudos["scheduled"] ?? 0}
              label={statusCodeToView["scheduled"]}
              className="bg-blue-400 text-white"
              type="page"
              status="scheduled"
              onClick={onSelectStatus}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatusCard
              count={countsLaudos["no_technical_visit"] ?? 0}
              label={statusCodeToView["no_technical_visit"]}
              className="bg-blue-200 text-gray-900"
              type="page"
              status="no_technical_visit"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsLaudos["in_development"] ?? 0}
              label={statusCodeToView["in_development"]}
              className="bg-gray-200 text-gray-900"
              type="page"
              status="in_development"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsLaudos["waiting_signature"] ?? 0}
              label={statusCodeToView["waiting_signature"]}
              className="bg-orange-200 text-gray-900"
              type="page"
              status="waiting_signature"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsLaudos["done_delivered"] ?? 0}
              label={statusCodeToView["done_delivered"]}
              className="bg-green-800 text-white"
              type="page"
              status="done_delivered"
              onClick={onSelectStatus}
            />
          </div>
        </section>

        {/* 3) SEÇÃO "TREINAMENTOS" => type="training" */}
        <section>
          <h2 className="text-xl font-bold mb-4">TREINAMENTOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <StatusCard
              count={countsTraining["pending"] ?? 0}
              label={statusCodeToView["pending"]}
              className="bg-yellow-400 text-gray-900"
              type="training"
              status="pending"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsTraining["contacting_client"] ?? 0}
              label={statusCodeToView["contacting_client"]}
              className="bg-blue-200 text-gray-900"
              type="training"
              status="contacting_client"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsTraining["to_schedule"] ?? 0}
              label={statusCodeToView["to_schedule"]}
              className="bg-blue-300 text-gray-900"
              type="training"
              status="to_schedule"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsTraining["scheduled"] ?? 0}
              label={statusCodeToView["scheduled"]}
              className="bg-blue-400 text-white"
              type="training"
              status="scheduled"
              onClick={onSelectStatus}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatusCard
              count={countsTraining["no_technical_visit"] ?? 0}
              label={statusCodeToView["no_technical_visit"]}
              className="bg-blue-200 text-gray-900"
              type="training"
              status="no_technical_visit"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsTraining["in_development"] ?? 0}
              label={statusCodeToView["in_development"]}
              className="bg-gray-200 text-gray-900"
              type="training"
              status="in_development"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsTraining["waiting_signature"] ?? 0}
              label={statusCodeToView["waiting_signature"]}
              className="bg-orange-200 text-gray-900"
              type="training"
              status="waiting_signature"
              onClick={onSelectStatus}
            />
            <StatusCard
              count={countsTraining["done_delivered"] ?? 0}
              label={statusCodeToView["done_delivered"]}
              className="bg-green-800 text-white"
              type="training"
              status="done_delivered"
              onClick={onSelectStatus}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
