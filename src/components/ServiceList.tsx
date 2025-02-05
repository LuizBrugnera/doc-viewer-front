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
import { OsService } from "@/services/OsService";

interface Service {
  id: number;
  cod: string;
  name: string;
  sellValue: string;
  description: string;
  duration: string | null;
  type: string;
}

export function ServiceList() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
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
        duration: selectedService.duration,
        type: selectedService.type,
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

  const translateType = (type: string) => {
    if (type === "page") {
      return "Laudo";
    } else if (type === "training") {
      return "Treinamento";
    }
  };

  const updateOsWithServices = async () => {
    await OsService.updateOsWithServices(token!);
    window.location.reload();
  };

  // 1) Ao clicar em "Atualizar", abrimos o modal de aviso
  const handleOpenWarningModal = () => {
    setIsWarningModalOpen(true);
  };

  // 2) Se o usuário confirmar, chamamos a atualização real
  const confirmUpdateServices = async () => {
    setIsWarningModalOpen(false); // fecha o modal
    await updateOsWithServices(); // chama a atualização
  };

  // 3) Se o usuário desistir, apenas fecha o modal
  const cancelUpdateServices = () => {
    setIsWarningModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Lista de Serviços</h1>

      <div className="mb-6 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Buscar por nome ou código"
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
        <Button
          onClick={handleOpenWarningModal}
          className="bg-blue-500 text-white"
        >
          Atualizar
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Valor de Venda</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Tipo</TableHead>
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
              <TableCell>{translateType(service.type)}</TableCell>
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

              {/* NOVO CAMPO: Tipo */}
              <label className="block mb-2">
                Tipo:
                <select
                  value={selectedService.type}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      type: e.target.value,
                    })
                  }
                  className="mt-1 border border-gray-300 rounded p-2 w-full"
                >
                  <option value="page">Laudo (page)</option>
                  <option value="training">Treinamento (training)</option>
                </select>
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
      {/* Modal de Aviso - Confirmar Update */}
      {isWarningModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold">Atualização Pesada</h2>
            <p className="mt-4">
              Este processo pode exigir bastante processamento do servidor.
              Deseja realmente continuar?
            </p>
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                className="mr-2"
                onClick={cancelUpdateServices}
              >
                Cancelar
              </Button>
              <Button onClick={confirmUpdateServices}>Prosseguir</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
