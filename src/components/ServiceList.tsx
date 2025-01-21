"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceDataService } from "@/services/ServiceDataService";
import useAuth from "@/security/UseAuth";

interface Service {
  id: number;
  cod: string;
  name: string;
  sellValue: string;
  description: string;
  duration: string | null;
}

export function ServiceList() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await ServiceDataService.findAllServiceData(token!);
      setServices(data);
    };

    fetchServices();
  }, [token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsVisible(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsEditVisible(true);
  };

  const handleClose = () => {
    setIsDetailsVisible(false);
    setIsEditVisible(false);
    setSelectedService(null);
  };

  const updateService = async () => {
    if (selectedService) {
      await ServiceDataService.updateServiceData(token!, {
        id: selectedService.id,
        cod: selectedService.cod,
        name: selectedService.name,
        sellValue: selectedService.sellValue,
        description: selectedService.description,
        duration: selectedService.duration, // <-- Incluímos a "duration"
      });

      const updatedServices = await ServiceDataService.findAllServiceData(
        token!
      );
      setServices(updatedServices);
      handleClose();
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.cod.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Lista de Serviços</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar por nome ou código"
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Valor de Venda</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.cod}</TableCell>
              <TableCell>{service.name}</TableCell>
              <TableCell className="min-w-[100px]">
                R$ {service.sellValue}
              </TableCell>
              <TableCell>{service.duration || "N/A"}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 mb-5"
                  onClick={() => handleEdit(service)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDetails(service)}
                >
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Detalhes */}
      {isDetailsVisible && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold">Detalhes do Serviço</h2>
            <p>
              <strong>Código:</strong> {selectedService.cod}
            </p>
            <p>
              <strong>Nome:</strong> {selectedService.name}
            </p>
            <p>
              <strong>Valor de Venda:</strong> R$ {selectedService.sellValue}
            </p>
            <p>
              <strong>Duração:</strong> {selectedService.duration || "N/A"}
            </p>
            <p>
              <strong>Descrição:</strong> {selectedService.description}
            </p>
            <Button onClick={handleClose} className="mt-4">
              Fechar
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditVisible && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold">Editar Serviço</h2>
            <form className="mt-4">
              <label className="block mb-2">
                Nome:
                <Input
                  type="text"
                  value={selectedService.name}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      name: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </label>
              <label className="block mb-2">
                Valor de Venda:
                <Input
                  type="text"
                  value={selectedService.sellValue}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      sellValue: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </label>

              {/* NOVO CAMPO: Duração */}
              <label className="block mb-2">
                Duração:
                <Input
                  type="text"
                  value={selectedService.duration || ""}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      duration: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </label>

              <label className="block mb-2">
                Descrição:
                <Input
                  type="text"
                  value={selectedService.description}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </label>
              <div className="flex justify-end mt-4">
                <Button type="button" onClick={handleClose} className="mr-2">
                  Cancelar
                </Button>

                <Button type="button" onClick={updateService}>
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
