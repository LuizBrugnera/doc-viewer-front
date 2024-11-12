"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Exam {
  cod: string;
  exam: string;
  days: string;
}

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([
    { cod: "568", exam: "Aso", days: "1" },
    { cod: "882", exam: "Hemograma", days: "3" },
    { cod: "460", exam: "Glicemia", days: "3" },
    { cod: "789", exam: "Audiometria", days: "1" },
    { cod: "856", exam: "Eletrocardiograma", days: "4" },
    { cod: "668", exam: "Eletroencefalograma", days: "4" },
    { cod: "568", exam: "Tgo", days: "6" },
    { cod: "166", exam: "Tgp", days: "6" },
    { cod: "151", exam: "Ppf", days: "3" },
    { cod: "584", exam: "Coprocultura", days: "3" },
    { cod: "651", exam: "Acido", days: "6" },
    { cod: "848", exam: "Rx de torax", days: "4" },
  ]);

  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [newExam, setNewExam] = useState<Exam>({ cod: "", exam: "", days: "" });

  const handleEdit = (exam: Exam) => {
    setEditingExam({ ...exam });
  };

  const handleSaveEdit = () => {
    if (editingExam) {
      setExams(
        exams.map((exam) => (exam.cod === editingExam.cod ? editingExam : exam))
      );
      setEditingExam(null);
    }
  };

  const handleAdd = () => {
    setExams([...exams, newExam]);
    setNewExam({ cod: "", exam: "", days: "" });
  };

  return (
    <div className="p-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-purple-600 mb-4">
          EXAMES COMPLEMENTARES Á FAZER
        </h2>
        <table className="w-full">
          <thead>
            <tr className="bg-purple-100">
              <th className="p-2 text-left">Cod:</th>
              <th className="p-2 text-left">Exame Ocupacional:</th>
              <th className="p-2 text-left">Dia Útens:</th>
              <th className="p-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {exams.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-2">{item.cod}</td>
                <td className="p-2">{item.exam}</td>
                <td className="p-2">{item.days}</td>
                <td className="p-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Exame</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cod" className="text-right">
                            Cod:
                          </Label>
                          <Input
                            id="cod"
                            value={editingExam?.cod}
                            onChange={(e) =>
                              setEditingExam({
                                ...editingExam!,
                                cod: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="exam" className="text-right">
                            Exame:
                          </Label>
                          <Input
                            id="exam"
                            value={editingExam?.exam}
                            onChange={(e) =>
                              setEditingExam({
                                ...editingExam!,
                                exam: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="days" className="text-right">
                            Dias:
                          </Label>
                          <Input
                            id="days"
                            value={editingExam?.days}
                            onChange={(e) =>
                              setEditingExam({
                                ...editingExam!,
                                days: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveEdit}>Salvar</Button>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="mt-4 text-purple-600 hover:text-purple-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar exame na listagem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Exame</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-cod" className="text-right">
                  Cod:
                </Label>
                <Input
                  id="new-cod"
                  value={newExam.cod}
                  onChange={(e) =>
                    setNewExam({ ...newExam, cod: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-exam" className="text-right">
                  Exame:
                </Label>
                <Input
                  id="new-exam"
                  value={newExam.exam}
                  onChange={(e) =>
                    setNewExam({ ...newExam, exam: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-days" className="text-right">
                  Dias:
                </Label>
                <Input
                  id="new-days"
                  value={newExam.days}
                  onChange={(e) =>
                    setNewExam({ ...newExam, days: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAdd}>Adicionar</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
