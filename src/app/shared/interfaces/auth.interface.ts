export interface LoginResponse {
  id: number;
  customerId: number | null;
  instructorId: number | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  token: string;
  role: 'CUSTOMER' | 'INSTRUCTOR';
  message: string;
  isAdmin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}
