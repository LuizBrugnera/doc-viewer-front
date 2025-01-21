"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye } from 'lucide-react'

interface Employee {
  id: number
  name: string
  cpf: string
  birthDate: string
  email: string
  phone: string
  exams: {
    total: number
    completed: number
    pending: number
  }
  status: "Liberado" | "Realizado" | "Pendente"
}

export default function EmployeeExamStatus() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "João Silva",
      cpf: "123.456.789-00",
      birthDate: "15/05/1985",
      email: "joao.silva@example.com",
      phone: "(11) 98765-4321",
      exams: { total: 5, completed: 5, pending: 0 },
      status: "Liberado",
    },
    {
      id: 2,
      name: "Maria Santos",
      cpf: "987.654.321-00",
      birthDate: "22/09/1990",
      email: "maria.santos@example.com",
      phone: "(11) 91234-5678",
      exams: { total: 4, completed: 4, pending: 0 },
      status: "Realizado",
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      cpf: "456.789.123-00",
      birthDate: "10/12/1988",
      email: "pedro.oliveira@example.com",
      phone: "(11) 92345-6789",
      exams: { total: 3, completed: 1, pending: 2 },
      status: "Pendente",
    },
    {
      id: 4,
      name: "Ana Rodrigues",
      cpf: "789.123.456-00",
      birthDate: "03/07/1992",
      email: "ana.rodrigues@example.com",
      phone: "(11) 93456-7890",
      exams: { total: 5, completed: 3, pending: 2 },
      status: "Pendente",
    },
    {
      id: 5,
      name: "Carlos Ferreira",
      cpf: "321.654.987-00",
      birthDate: "28/02/1987",
      email: "carlos.ferreira@example.com",
      phone: "(11) 94567-8901",
      exams: { total: 4, completed: 4, pending: 0 },
      status: "Liberado",
    },
  ])

  const statusCounts = {
    Liberado: employees.filter((emp) => emp.status === "Liberado").length,
    Realizado: employees.filter((emp) => emp.status === "Realizado").length,
    Pendente: employees.filter((emp) => emp.status === "Pendente").length,
  }

  return (
    <div className="p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="bg-green-600 text-white">
            <CardTitle>Liberados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{statusCounts.Liberado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle>Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{statusCounts.Realizado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-yellow-600 text-white">
            <CardTitle>Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{statusCounts.Pendente}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-600">
            LISTA DE FUNCIONÁRIOS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-100">
                  <th className="p-2 text-left">Nome</th>
                  <th className="p-2 text-left">CPF</th>
                  <th className="p-2 text-left">Exames</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Ação</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="p-2">{employee.name}</td>
                    <td className="p-2">{employee.cpf}</td>
                    <td className="p-2">
                      {employee.exams.completed}/{employee.exams.total}
                    </td>
                    <td className="p-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          employee.status === "Liberado"
                            ? "bg-green-200 text-green-800"
                            : employee.status === "Realizado"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View employee details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes do Funcionário</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                              <span className="font-bold">Nome:</span>
                              <span className="col-span-2">{employee.name}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <span className="font-bold">CPF:</span>
                              <span className="col-span-2">{employee.cpf}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <span className="font-bold">Data de Nascimento:</span>
                              <span className="col-span-2">{employee.birthDate}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <span className="font-bold">E-mail:</span>
                              <span className="col-span-2">{employee.email}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <span className="font-bold">Telefone:</span>
                              <span className="col-span-2">{employee.phone}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <span className="font-bold">Status:</span>
                              <span className="col-span-2">{employee.status}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <span className="font-bold">Exames:</span>
                              <span className="col-span-2">
                                Concluídos: {employee.exams.completed}<br />
                                Pendentes: {employee.exams.pending}<br />
                                Total: {employee.exams.total}
                              </span>
                            </div>
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
  )
}

