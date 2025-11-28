
export interface User {
  customerId: string | null;
  vendorId: string | null;
  tier: string;
  country: string;
  password: string | null;
  accessToken: string;
  emailAddress: string;
  enablePush: boolean;
  firstName: string;
  hasPin: boolean;
  lastName: string;
  phoneNumber: string;
  profileImage: string | null;
  refreshToken: string;
  role: string;
  saveCard: boolean;
}

export interface AuthResponse {
  user: User;
  customerId: string | null;
  vendorId: string | null;
  tier: string;
  country: string;
  password: string | null;
  accessToken: string;
  emailAddress: string;
  enablePush: boolean;
  firstName: string;
  hasPin: boolean;
  lastName: string;
  phoneNumber: string;
  profileImage: string | null;
  refreshToken: string;
  role: string;
  saveCard: boolean;
}