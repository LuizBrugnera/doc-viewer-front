export interface User {
  id: string;
  name: string;
  mainEmail: string;
  password: string;
  department: string;
  role: "admin" | "user" | "department" | "exames" | "exames-admin";
  rg?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  cod?: string;
  birthdate?: string;
  dodcuments?: Document[];
  adminLogs?: Log[];
  folderAccess?: { foldername: string }[];
}

export interface Admin {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface AdminUpdate {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export interface DepartmentUpdate {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export interface FoldersAccess {
  id: number;
  foldername: string;
}

export interface Department {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  department: string;
  emailTemplate: string;
  foldersAccess: FoldersAccess[];
  logs: Log[];
}

export interface DepartmentCreate {
  name: string;
  email: string;
  phone: string;
  password: string;
  department: string;
  foldersAccess: { foldername: string }[];
}

export interface AuthContextData {
  user: User | null;
  userInfo: InfoCommum | null;
  updateUserInfo: () => void;
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

export interface EmailLogin {
  email: string;
  password: string;
}

export interface LoginData {
  email?: string;
  cpf?: string;
  cnpj?: string;
  password: string;
}

export interface Log {
  id: number;
  description: string;
  state: string;
  action: string;
  date: string;
  created_at: string;
  updated_at: string;
  departmentId: number;
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
  id?: number | null;
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
  user: Partial<User>;
  folder: string;
}

export interface ResponseUpload {
  name: string;
  status: number;
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

export interface InfoCommum {
  name: string;
  email: string;
  mainEmail?: string;
  cnpj?: string;
  rg?: string;
  cpf?: string;
  cod?: string;
  phone?: string;
  department?: string;
  adminLogs?: Log[];
  logs?: Log[];
}
