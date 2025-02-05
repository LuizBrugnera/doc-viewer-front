interface Filters {
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  client: string;
  orderNumber: string;
}

interface DashboardOrder {
  id: string;
  type: string;
  status: string;
  client: string;
  date: string;
}

interface Order {
  id: string;
  client: string;
  clientCode: string;
  entryDate: string;
  exitDate: string;
  equipment: string;
  status: string;
  value: number;
  store: string;
  type: string;
}

export async function fetchFilteredDataDashboard(
  filters: Filters
): Promise<DashboardOrder[]> {
  // Simula chamada de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock de dados (exemplo do seu Dashboard)
  const allData: DashboardOrder[] = [
    {
      id: "40439",
      type: "status",
      status: "pendente",
      client: "AM COMERCIO DE ACOS LTDA",
      date: "2025-01-13",
    },
    {
      id: "40440",
      type: "laudo",
      status: "em-elaboracao",
      client: "XYZ INDUSTRIA",
      date: "2025-01-14",
    },
    {
      id: "40441",
      type: "treinamento",
      status: "agendado",
      client: "ABC CORPORATION",
      date: "2025-01-15",
    },
    {
      id: "40442",
      type: "status",
      status: "concluida",
      client: "TECH SOLUTIONS LTDA",
      date: "2025-01-16",
    },
    {
      id: "40443",
      type: "laudo",
      status: "pendente",
      client: "GLOBAL MANUFACTURING INC",
      date: "2025-01-17",
    },
    {
      id: "40444",
      type: "treinamento",
      status: "em-andamento",
      client: "SAFETY FIRST CO",
      date: "2025-01-18",
    },
    {
      id: "40445",
      type: "status",
      status: "atraso",
      client: "METALURGICA BRASIL SA",
      date: "2025-01-19",
    },
    {
      id: "40446",
      type: "laudo",
      status: "concluido",
      client: "INDUSTRIAS UNIDAS LTDA",
      date: "2025-01-20",
    },
    {
      id: "40447",
      type: "treinamento",
      status: "cancelado",
      client: "CONSTRUTORA HORIZONTE",
      date: "2025-01-21",
    },
    {
      id: "40448",
      type: "status",
      status: "em-andamento",
      client: "PETROBRAS",
      date: "2025-01-22",
    },
  ];

  // Filtro básico
  return allData.filter((item) => {
    const matchesType = !filters.type || item.type === filters.type;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesClient =
      !filters.client ||
      item.client.toLowerCase().includes(filters.client.toLowerCase());
    const matchesOrderNumber =
      !filters.orderNumber || item.id === filters.orderNumber;

    const itemDate = new Date(item.date);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    const matchesStartDate = !start || itemDate >= start;
    const matchesEndDate = !end || itemDate <= end;

    return (
      matchesType &&
      matchesStatus &&
      matchesClient &&
      matchesOrderNumber &&
      matchesStartDate &&
      matchesEndDate
    );
  });
}

// ----------------------------------------------------
// Função mock para filtrar dados das Ordens de Serviço
// ----------------------------------------------------
export async function fetchFilteredDataService(
  filters: Filters
): Promise<Order[]> {
  // Simula chamada de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock de dados (exemplo da sua ServiceOrdersPage)
  const allData: Order[] = [
    {
      id: "40439",
      client: "AM COMERCIO DE ACOS LTDA",
      clientCode: "AM ACOS",
      entryDate: "2025-01-13 12:38",
      exitDate: "",
      equipment: "RENOVAÇÃO LAUDOS",
      status: "Pendente",
      value: 1200.0,
      store: "LAPAMEDSEG",
      type: "status",
    },
    {
      id: "40440",
      client: "XYZ INDUSTRIA",
      clientCode: "XYZ",
      entryDate: "2025-01-14 10:00",
      exitDate: "",
      equipment: "MANUTENÇÃO PREVENTIVA",
      status: "Em elaboração",
      value: 1500.0,
      store: "MAINSTORE",
      type: "laudo",
    },
    {
      id: "40441",
      client: "ABC CORPORATION",
      clientCode: "ABC",
      entryDate: "2025-01-15 14:30",
      exitDate: "2025-01-16 09:00",
      equipment: "TREINAMENTO SEGURANÇA",
      status: "Concluído",
      value: 2000.0,
      store: "TRAININGCENTER",
      type: "treinamento",
    },
    {
      id: "40442",
      client: "TECH SOLUTIONS LTDA",
      clientCode: "TECHSOL",
      entryDate: "2025-01-16 08:45",
      exitDate: "2025-01-17 16:30",
      equipment: "CALIBRAÇÃO EQUIPAMENTOS",
      status: "Concluído",
      value: 3500.0,
      store: "CALIBRACENTER",
      type: "status",
    },
    {
      id: "40443",
      client: "GLOBAL MANUFACTURING INC",
      clientCode: "GLOBALMFG",
      entryDate: "2025-01-17 11:20",
      exitDate: "",
      equipment: "AVALIAÇÃO DE RISCOS",
      status: "Pendente",
      value: 4200.0,
      store: "RISKCENTER",
      type: "laudo",
    },
    {
      id: "40444",
      client: "SAFETY FIRST CO",
      clientCode: "SAFEFIRST",
      entryDate: "2025-01-18 09:15",
      exitDate: "",
      equipment: "TREINAMENTO PRIMEIROS SOCORROS",
      status: "Em andamento",
      value: 1800.0,
      store: "TRAININGCENTER",
      type: "treinamento",
    },
    {
      id: "40445",
      client: "METALURGICA BRASIL SA",
      clientCode: "METALBR",
      entryDate: "2025-01-19 13:40",
      exitDate: "",
      equipment: "INSPEÇÃO DE SEGURANÇA",
      status: "Em atraso",
      value: 2800.0,
      store: "INSPECENTER",
      type: "status",
    },
    {
      id: "40446",
      client: "INDUSTRIAS UNIDAS LTDA",
      clientCode: "INDUNIDAS",
      entryDate: "2025-01-20 10:30",
      exitDate: "2025-01-21 14:45",
      equipment: "LAUDO TÉCNICO",
      status: "Concluído",
      value: 3200.0,
      store: "LAUDOCENTER",
      type: "laudo",
    },
    {
      id: "40447",
      client: "CONSTRUTORA HORIZONTE",
      clientCode: "CONSHORI",
      entryDate: "2025-01-21 08:00",
      exitDate: "",
      equipment: "TREINAMENTO NR-35",
      status: "Cancelado",
      value: 1600.0,
      store: "TRAININGCENTER",
      type: "treinamento",
    },
    {
      id: "40448",
      client: "PETROBRAS",
      clientCode: "PETRO",
      entryDate: "2025-01-22 11:00",
      exitDate: "",
      equipment: "AVALIAÇÃO AMBIENTAL",
      status: "Em andamento",
      value: 5000.0,
      store: "ENVCENTER",
      type: "status",
    },
  ];

  // Filtro básico
  return allData.filter((item) => {
    const matchesType = !filters.type || item.type === filters.type;
    const matchesStatus =
      !filters.status ||
      item.status.toLowerCase() === filters.status.toLowerCase();
    const matchesClient =
      !filters.client ||
      item.client.toLowerCase().includes(filters.client.toLowerCase());
    const matchesOrderNumber =
      !filters.orderNumber || item.id === filters.orderNumber;

    const itemDate = new Date(item.entryDate);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    const matchesStartDate = !start || itemDate >= start;
    const matchesEndDate = !end || itemDate <= end;

    return (
      matchesType &&
      matchesStatus &&
      matchesClient &&
      matchesOrderNumber &&
      matchesStartDate &&
      matchesEndDate
    );
  });
}

import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/os";

interface OsUpdate {
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
  type: string;
}

// Interface para o novo formato
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

export const OsService = {
  async updateOsWithServices(token: string): Promise<void> {
    await axios.patch(
      `${API_URL}/update-services`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async findAllOs(token: string): Promise<ServiceOrder[]> {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async updateOs(token: string, os: OsUpdate): Promise<void> {
    await axios.put(`${API_URL}/${os.id}`, os, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async deleteOs(token: string, id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
