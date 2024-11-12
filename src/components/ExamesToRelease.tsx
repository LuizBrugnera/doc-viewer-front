"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Check, Paperclip, Upload } from "lucide-react";

interface ClientData {
  id: number;
  name: string;
  birthDate: string;
  rg: string;
  cpf: string;
  email: string;
  phone: string;
  exams: Exam[];
}

interface Exam {
  name: string;
  date: string;
  status: "Pendente" | "Realizado";
  attachments?: string[];
}

export default function ExamesToRelease() {
  const [clientsData, setClientsData] = useState<ClientData[]>([
    {
      id: 1234567,
      name: "Deivid Vandersa Santana",
      birthDate: "02/06/1998 – 26 anos",
      rg: "52.111.222-X",
      cpf: "254.448.888-55",
      email: "deivid@gmail.com.br",
      phone: "(11) 9.4891-5296",
      exams: [
        { name: "Aso", date: "27/09/2024", status: "Pendente" },
        { name: "Hemograma", date: "27/09/2024", status: "Pendente" },
        { name: "Glicemia", date: "27/09/2024", status: "Pendente" },
      ],
    },
    {
      id: 1234568,
      name: "Debora Santana",
      birthDate: "15/03/1995 – 29 anos",
      rg: "45.222.333-Y",
      cpf: "123.456.789-00",
      email: "debora@gmail.com.br",
      phone: "(11) 9.8765-4321",
      exams: [
        { name: "Aso", date: "27/09/2024", status: "Pendente" },
        { name: "Audiometria", date: "27/09/2024", status: "Pendente" },
        { name: "Eletrocardiograma", date: "27/09/2024", status: "Pendente" },
        { name: "Eletroencefalograma", date: "27/09/2024", status: "Pendente" },
      ],
    },
    {
      id: 1234569,
      name: "Beatriz Souza",
      birthDate: "22/11/1990 – 34 anos",
      rg: "33.444.555-Z",
      cpf: "987.654.321-00",
      email: "beatriz@gmail.com.br",
      phone: "(11) 9.1234-5678",
      exams: [
        { name: "Aso", date: "27/09/2024", status: "Pendente" },
        { name: "Hemograma", date: "27/09/2024", status: "Pendente" },
      ],
    },
    {
      id: 1234570,
      name: "Guilherme Oliveira",
      birthDate: "10/07/1992 – 32 anos",
      rg: "22.333.444-W",
      cpf: "456.789.123-00",
      email: "guilherme@gmail.com.br",
      phone: "(11) 9.8765-1234",
      exams: [
        { name: "Aso", date: "27/09/2024", status: "Pendente" },
        { name: "Glicemia", date: "27/09/2024", status: "Pendente" },
        { name: "Audiometria", date: "27/09/2024", status: "Pendente" },
      ],
    },
    {
      id: 1234571,
      name: "Luiz Henrique",
      birthDate: "05/09/1988 – 36 anos",
      rg: "11.222.333-V",
      cpf: "789.123.456-00",
      email: "luiz@gmail.com.br",
      phone: "(11) 9.4321-5678",
      exams: [
        { name: "Aso", date: "27/09/2024", status: "Pendente" },
        { name: "Eletrocardiograma", date: "27/09/2024", status: "Pendente" },
        { name: "Eletroencefalograma", date: "27/09/2024", status: "Pendente" },
      ],
    },
  ]);

  const [currentClientIndex, setCurrentClientIndex] = useState<number>(0);
  const [currentExamIndex, setCurrentExamIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClientChange = (index: number) => {
    setCurrentClientIndex(index);
  };

  const handleExamStatusChange = (examIndex: number) => {
    const updatedClientsData = [...clientsData];
    const currentClient = updatedClientsData[currentClientIndex];
    currentClient.exams[examIndex].status =
      currentClient.exams[examIndex].status === "Pendente"
        ? "Realizado"
        : "Pendente";
    setClientsData(updatedClientsData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && currentExamIndex !== null) {
      const updatedClientsData = [...clientsData];
      const currentClient = updatedClientsData[currentClientIndex];
      const currentExam = currentClient.exams[currentExamIndex];

      currentExam.attachments = currentExam.attachments || [];
      for (let i = 0; i < files.length; i++) {
        currentExam.attachments.push(files[i].name);
      }

      setClientsData(updatedClientsData);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              FUNCIONARIOS Á ATENDER
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {clientsData.map((client, index) => (
                <li
                  key={client.id}
                  className={`flex justify-between items-center ${
                    index === currentClientIndex ? "underline" : ""
                  }`}
                >
                  <span>
                    {client.id} {client.name}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleClientChange(index)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View client details</span>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-600">
              DADOS DO CLIENTE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Dados da Empresa:</p>
                <p>Empresa: Betel Seg Assessoria</p>
                <p>CNPJ: 18.913.225/0001-40</p>
              </div>
              <div>
                <p className="text-right">
                  Número Aso: {clientsData[currentClientIndex].id}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-bold">Dados do Colaborador:</p>
              <p>Nome do Paciente: {clientsData[currentClientIndex].name}</p>
              <p>
                Data de Nascimento: {clientsData[currentClientIndex].birthDate}
              </p>
              <p>RG: {clientsData[currentClientIndex].rg}</p>
              <p>CPF: {clientsData[currentClientIndex].cpf}</p>
              <p>E-mail do Paciente: {clientsData[currentClientIndex].email}</p>
              <p>
                Telefone do Paciente: {clientsData[currentClientIndex].phone}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-600">
            EXAMES COMPLEMENTARES Á FAZER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-100">
                  <th className="p-2 text-left">Exames Complementar</th>
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Ação</th>
                </tr>
              </thead>
              <tbody>
                {clientsData[currentClientIndex].exams.map((exam, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="p-2">{exam.name}</td>
                    <td className="p-2">{exam.date}</td>
                    <td className="p-2">
                      <span
                        className={`inline-block w-3 h-3 ${
                          exam.status === "Realizado"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } rounded-full mr-2`}
                      ></span>
                      {exam.status === "Realizado"
                        ? "Exame realizado"
                        : "Exame pendente"}
                    </td>
                    <td className="p-2">
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View exam details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleExamStatusChange(index)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Mark exam as completed</span>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentExamIndex(index)}
                          >
                            <Paperclip className="h-4 w-4" />
                            <span className="sr-only">Attach file to exam</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Anexar Arquivos ao Exame</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">
                                      Clique para fazer upload
                                    </span>{" "}
                                    ou arraste e solte
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG ou GIF (MAX. 800x400px)
                                  </p>
                                </div>
                                <input
                                  id="dropzone-file"
                                  type="file"
                                  className="hidden"
                                  multiple
                                  onChange={handleFileUpload}
                                  ref={fileInputRef}
                                />
                              </label>
                            </div>
                            {exam.attachments &&
                              exam.attachments.length > 0 && (
                                <div>
                                  <h3 className="font-bold mb-2">
                                    Arquivos anexados:
                                  </h3>
                                  <ul className="list-disc pl-5">
                                    {exam.attachments.map((file, fileIndex) => (
                                      <li key={fileIndex}>{file}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
