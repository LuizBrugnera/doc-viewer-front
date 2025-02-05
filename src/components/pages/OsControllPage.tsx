import { useState, useEffect } from "react";
import Dashboard from "../Dashboard";
import { ServiceOrdersPage } from "../ServiceOrdersPage";
import { ServiceList } from "../ServiceList";
import { OsService } from "@/services/OsService";
import useAuth from "@/security/UseAuth";
import { ServiceDataService } from "@/services/ServiceDataService";
import { useNavigate } from "react-router-dom";

interface Filters {
  type: "page" | "training" | "os";
  status: string;
  startDate: string;
  endDate: string;
  client: string;
  orderNumber: string;
  store: string; // NOVO
  seller: string; // NOVO
}

interface ServiceDataService {
  id: number;
  cod: string;
  name: string;
  sellValue: string;
  description: string;
  duration: string | null;
  type: string;
}

// Interface para o novo formato
interface ServiceOrder {
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
  // No backend, apenas "page" ou "training". Usamos "os" para somar ambos.
  type: "page" | "training" | "os";
}

export default function OsControllPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "serviceOrders" | "services"
  >("dashboard");

  const [services, setServices] = useState<ServiceDataService[]>([]);

  // Estado global de filtros
  const [externalFilters, setExternalFilters] = useState<Filters>({
    type: "os", // Inicia como "os" (ou "")
    status: "",
    startDate: "",
    endDate: "",
    client: "",
    orderNumber: "",
    store: "", // inicia vazio
    seller: "", // inicia vazio
  });

  // Estado para armazenar as ordens no formato desejado
  const [orders, setOrders] = useState<ServiceOrder[]>([]);

  useEffect(() => {
    const fetchOs = async () => {
      const data = await OsService.findAllOs(token!);
      setOrders(data);
    };
    fetchOs();
    console.log("orders", orders);
  }, [token]);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await ServiceDataService.findAllServiceData(token!);
      setServices(data);
    };

    fetchServices();
  }, [token]);

  /**
   * Quando o usuário clica em algum card no Dashboard,
   * chamamos onSelectStatus(type, status). Aqui definimos
   * externalFilters e navegamos para "serviceOrders".
   */
  const handleSelectStatus = (type: string, status: string) => {
    setExternalFilters((old) => ({
      ...old,
      type: type as "page" | "training" | "os", // Faz cast
      status,
    }));
    setCurrentPage("serviceOrders");
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => setCurrentPage("dashboard")}
              className={currentPage === "dashboard" ? "font-bold" : ""}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentPage("serviceOrders")}
              className={currentPage === "serviceOrders" ? "font-bold" : ""}
            >
              Ordens de Serviço
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentPage("services")}
              className={currentPage === "services" ? "font-bold" : ""}
            >
              Serviços
            </button>
          </li>
        </ul>
        <button onClick={() => navigate("/login")}>Sair</button>
      </nav>

      {currentPage === "dashboard" && (
        <Dashboard
          onSelectStatus={handleSelectStatus}
          ordersProp={orders}
          servicesProp={services}
        />
      )}
      {currentPage === "serviceOrders" && (
        <ServiceOrdersPage
          filtersProp={externalFilters}
          ordersProp={orders}
          servicesProp={services}
        />
      )}
      {currentPage === "services" && <ServiceList />}
    </div>
  );
}
