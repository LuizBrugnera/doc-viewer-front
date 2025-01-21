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

type ClientDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  formData: {
    name: string;
    mainEmail: string;
    phone: string;
    rg: string;
    cnpj: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (field: string, value: any) => void;
  isEditMode: boolean; // Adicionado para diferenciar os modos
};

export default function ClientDialog({
  isOpen,
  onClose,
  onSave,
  formData,
  onChange,
  isEditMode,
}: ClientDialogProps) {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações do usuário."
              : "Preencha os detalhes do novo usuário."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Usuário*</Label>
              <Input
                id="clientName"
                placeholder="Digite o nome do cliente"
                required
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email do Usuário*</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="cliente@example.com"
                required
                value={formData.mainEmail}
                onChange={(e) => onChange("mainEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Telefone do Usuário</Label>
              <Input
                id="clientPhone"
                type="text"
                placeholder="(99) 999999999 OPCIONAL"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientRg">RG</Label>
              <Input
                id="clientRg"
                placeholder="Digite o RG"
                value={formData.rg}
                onChange={(e) => onChange("rg", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientCnpj">CNPJ</Label>
              <Input
                id="clientCnpj"
                placeholder="Digite o CNPJ"
                value={formData.cnpj}
                onChange={(e) => onChange("cnpj", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPassword">Senha</Label>
              <Input
                id="clientPassword"
                type="password"
                placeholder="Digite a senha"
                required={!isEditMode} // Só é obrigatório no modo de adição
                value={formData.password}
                onChange={(e) => onChange("password", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientConfirmPassword">Confirme a Senha</Label>
              <Input
                id="clientConfirmPassword"
                type="password"
                placeholder="Confirme a senha"
                required={!isEditMode} // Só é obrigatório no modo de adição
                value={formData.confirmPassword}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">
              {isEditMode ? "Atualizar Usuário" : "Adicionar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
