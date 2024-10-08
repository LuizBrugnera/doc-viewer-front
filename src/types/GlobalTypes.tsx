export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  department: string;
  role: "admin" | "user" | "department" | "exames";
  rg?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  cod?: string;
  birthdate?: string;
}

export interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateDataToken: (token: string) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf?: string;
  birthdate?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Log {
  id: number;
  description: string;
  userId: number;
  action: string;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  viewed: boolean;
}

export interface DefaultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface UserInfo {
  name?: string | null;
  email?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  phone?: string | null;
  rg?: string | null;
  cod?: string | null;
  birthdate?: string | null;
}

export interface DocumentMetaData {
  id: number;
  name: string;
  type: string;
  description: string;
  date: string;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  date: string;
  description: string;
  userId: number;
  folder: string;
}

export interface File {
  id: number;
  name: string;
  resource: "file";
  date: string;
  type: string;
}

export interface Folder {
  name: string;
  resource: "folder";
  contents: (File | Folder)[];
}

export interface Category {
  name: string;
  contents: Folder[];
}
