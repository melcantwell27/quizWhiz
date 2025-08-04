export interface Student {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  student: Student;
}

export interface RegisterRequest {
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
}

export interface AuthError {
  error: string;
} 