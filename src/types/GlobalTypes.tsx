export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  departmentId?: number;
  role: "admin" | "user" | "department";
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

export interface Department {
  id: number;
  name: string;
  email: string;
}

export interface UserCustomer {
  id: number;
  departmentId: number;
  name: string;
  email: string;
}

export interface Log {
  id: number;
  departmentId: number;
  action: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  viewed: boolean;
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
}
