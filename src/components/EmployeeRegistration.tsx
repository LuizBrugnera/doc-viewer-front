"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "../hooks/use-toast";

interface Employee {
  name: string
  cpf: string
  birthDate: string
  email: string
  phone: string
  position: string
}

export default function EmployeeRegistration() {
  const [step, setStep] = useState<'cnpj' | 'cpf' | 'review'>('cnpj')
  const [cnpj, setCnpj] = useState('')
  const [cpf, setCpf] = useState('')
  const [employee, setEmployee] = useState<Employee | null>(null)
  const { toast } = useToast()

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14)
  }

  const handleCnpjSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('cpf')
  }

  const handleCpfSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would fetch employee data based on the CPF
    // For this example, we'll use mock data
    setEmployee({
      name: "João da Silva",
      cpf: cpf,
      birthDate: "15/05/1985",
      email: "joao.silva@example.com",
      phone: "(11) 98765-4321",
      position: "Analista de Sistemas"
    })
    setStep('review')
  }

  const handleAddEmployee = () => {
    // In a real application, you would send the employee data to your backend
    toast({
      title: "Sucesso!",
      description: "Funcionário adicionado com sucesso ao sistema.",
      duration: 5000,
    })
    resetForm()
  }

  const handleCancel = () => {
    resetForm()
  }

  const resetForm = () => {
    setCnpj('')
    setCpf('')
    setEmployee(null)
    setStep('cnpj')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-600">
            Registro de Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'cnpj' && (
            <form onSubmit={handleCnpjSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ da Empresa</Label>
                  <Input
                    id="cnpj"
                    value={cnpj}
                    onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Próximo</Button>
              </div>
            </form>
          )}

          {step === 'cpf' && (
            <form onSubmit={handleCpfSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cpf">CPF do Funcionário</Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Buscar Funcionário</Button>
              </div>
            </form>
          )}

          {step === 'review' && employee && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados do Funcionário</h3>
              <div className="grid gap-2">
                <div>
                  <span className="font-semibold">Nome:</span> {employee.name}
                </div>
                <div>
                  <span className="font-semibold">CPF:</span> {employee.cpf}
                </div>
                <div>
                  <span className="font-semibold">Data de Nascimento:</span> {employee.birthDate}
                </div>
                <div>
                  <span className="font-semibold">E-mail:</span> {employee.email}
                </div>
                <div>
                  <span className="font-semibold">Telefone:</span> {employee.phone}
                </div>
                <div>
                  <span className="font-semibold">Cargo:</span> {employee.position}
                </div>
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddEmployee} className="flex-1">Adicionar Funcionário</Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">Cancelar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

