"use client";

import React, { useState } from "react";

interface ClientData {
  name: string;
  birthDate: string;
  rg: string;
  cpf: string;
  email: string;
  phone: string;
}

export const ExamesToPerform = () => {
  const clientsData: ClientData[] = [
    {
      name: "Deivid Vandersa Santana",
      birthDate: "02/06/1998 – 26 anos",
      rg: "52.111.222-X",
      cpf: "254.448.888-55",
      email: "deivid@gmail.com.br",
      phone: "(11) 9.4891-5296",
    },
    {
      name: "Debora Santana",
      birthDate: "15/03/1995 – 29 anos",
      rg: "45.222.333-Y",
      cpf: "123.456.789-00",
      email: "debora@gmail.com.br",
      phone: "(11) 9.8765-4321",
    },
    {
      name: "Beatriz Souza",
      birthDate: "22/11/1990 – 34 anos",
      rg: "33.444.555-Z",
      cpf: "987.654.321-00",
      email: "beatriz@gmail.com.br",
      phone: "(11) 9.1234-5678",
    },
    {
      name: "Guilherme Oliveira",
      birthDate: "10/07/1992 – 32 anos",
      rg: "22.333.444-W",
      cpf: "456.789.123-00",
      email: "guilherme@gmail.com.br",
      phone: "(11) 9.8765-1234",
    },
    {
      name: "Luiz Henrique",
      birthDate: "05/09/1988 – 36 anos",
      rg: "11.222.333-V",
      cpf: "789.123.456-00",
      email: "luiz@gmail.com.br",
      phone: "(11) 9.4321-5678",
    },
  ];

  const [currentClientIndex, setCurrentClientIndex] = useState<number>(0);
  const [currentClientData, setCurrentClientData] = useState<ClientData>(
    clientsData[0]
  );

  const handleClientChange = (index: number) => {
    setCurrentClientIndex(index);
    setCurrentClientData(clientsData[index]);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-600 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">FUNCIONARIOS Á ATENDER</h2>
          <ul className="space-y-2">
            {clientsData.map((client, index) => (
              <li
                key={index}
                className={`flex justify-between items-center ${
                  index === currentClientIndex ? "underline" : ""
                }`}
              >
                <span>
                  {1234567 + index} {client.name}
                </span>
                <button
                  className="bg-white text-purple-600 p-1 rounded"
                  onClick={() => handleClientChange(index)}
                >
                  👁
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-bold text-purple-600 mb-4">
            DADOS DO CLIENTE
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold">Dados da Empresa:</p>
              <p>Empresa: Betel Seg Assessoria</p>
              <p>CNPJ: 18.913.225/0001-40</p>
            </div>
            <div>
              <p className="text-right">Número Aso: 1234567</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold">Dados do Colaborador:</p>
            <p>Nome do Paciente: {currentClientData.name}</p>
            <p>Data de Nascimento: {currentClientData.birthDate}</p>
            <p>RG: {currentClientData.rg}</p>
            <p>CPF: {currentClientData.cpf}</p>
            <p>E-mail do Paciente: {currentClientData.email}</p>
            <p>Telefone do Paciente: {currentClientData.phone}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-purple-600 mb-4">
          EXAMES COMPLEMENTARES Á FAZER
        </h2>
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
            {[
              "Aso",
              "Hemograma",
              "Glicemia",
              "Audiometria",
              "Eletrocardiograma",
              "Eletroencefalograma",
            ].map((exam, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-2">{exam}</td>
                <td className="p-2">27/09/2024</td>
                <td className="p-2">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Realizado
                </td>
                <td className="p-2">
                  <button className="mr-2">✓</button>
                  <button>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Feito
        </button>
      </div>
    </div>
  );
};
