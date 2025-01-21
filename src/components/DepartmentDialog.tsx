/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FolderAccessSelector from "./FolderAccessSelector";
import { foldersToAcess } from "./utils";

type DepartmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    department: string;
    foldersAccess: { foldername: string }[];
    emailTemplate: string;
  };
  onChange: (field: string, value: any, field2?: string, value2?: any) => void;
  availableFolders: { [key: string]: string };
  isEditMode: boolean; 
};

export default function DepartmentDialog({
  isOpen,
  onClose,
  onSave,
  formData,
  onChange,
  availableFolders,
  isEditMode,
}: DepartmentDialogProps) {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Departamento" : "Adicionar Departamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações do departamento."
              : "Preencha os detalhes do novo departamento."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="departmentName">Nome do Departamento*</Label>
              <Input
                id="departmentName"
                placeholder="Digite o nome do departamento"
                required
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentEmail">Email do Departamento*</Label>
              <Input
                id="departmentEmail"
                type="email"
                placeholder="departamento@example.com"
                required
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentPhone">Telefone do Departamento</Label>
              <Input
                id="departmentPhone"
                type="text"
                placeholder="(99) 999999999 OPCIONAL"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentDepartment">Departamento*</Label>
              <select
                id="departmentDepartment"
                value={formData.department}
                onChange={(e) =>
                  onChange(
                    "department",
                    e.target.value,
                    "foldersAccess",
                    foldersToAcess[e.target.value]?.map((folder) => ({
                      foldername: folder,
                    }))
                  )
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="financeiro">Financeiro</option>
                <option value="documentosTecnicos">Documentos Técnicos</option>
                <option value="faturamento">Faturamento</option>
                <option value="esocial">E-social</option>
                <option value="vendas">Vendas</option>
                <option value="exames">Exames</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Pastas com Acesso</Label>
              <FolderAccessSelector
                availableFolders={availableFolders}
                selectedFolders={formData.foldersAccess}
                onFolderChange={(folder, checked) => {
                  onChange(
                    "foldersAccess",
                    checked
                      ? [...formData.foldersAccess, { foldername: folder }]
                      : formData.foldersAccess.filter(
                          (f) => f.foldername !== folder
                        )
                  );
                }}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="emailTemplate">Texto para enviar no email*</Label>
              <textarea
                id="emailTemplate"
                style={{
                  height: "200px",
                  width: "100%",
                  border: "1px solid gray",
                  borderRadius: "7px",
                  padding: "2px",
                }}
                placeholder="Digite o texto para enviar no email"
                value={formData.emailTemplate}
                onChange={(e) => onChange("emailTemplate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentPassword">Senha do Departamento*</Label>
              <Input
                id="departmentPassword"
                type="password"
                placeholder="********"
                required={!isEditMode} // Só é obrigatório no modo de adição
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentConfirmPassword">
                Confirme a Senha do Departamento*
              </Label>
              <Input
                id="departmentConfirmPassword"
                type="password"
                placeholder="********"
                required={!isEditMode} // Só é obrigatório no modo de adição
                value={formData.confirmPassword}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">
              {isEditMode
                ? "Atualizar Departamento"
                : "Adicionar Departamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
