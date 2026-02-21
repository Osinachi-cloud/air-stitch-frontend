
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





// export interface User {
//   customerId: string | null;
//   vendorId: string | null;
//   tier: string;
//   country: string;
//   password: string | null;
//   accessToken: string;
//   emailAddress: string;
//   enablePush: boolean;
//   firstName: string;
//   hasPin: boolean;
//   lastName: string;
//   phoneNumber: string;
//   profileImage: string | null;
//   refreshToken: string;
//   role: string;
//   saveCard: boolean;
// }

// export interface AuthResponse {
//   user: User;
//   customerId: string | null;
//   vendorId: string | null;
//   tier: string;
//   country: string;
//   password: string | null;
//   accessToken: string;
//   emailAddress: string;
//   enablePush: boolean;
//   firstName: string;
//   hasPin: boolean;
//   lastName: string;
//   phoneNumber: string;
//   profileImage: string | null;
//   refreshToken: string;
//   role: string;
//   saveCard: boolean;
// }

export interface IUserData {
    customerId: string | null;
    vendorId: string | null;
    tier: string | null;
    country: string | null;
    password: string | null; 
    firstName: string;
    lastName: string;
    emailAddress: string | number | boolean;
    phoneNumber: string;
    hasPin: boolean;
    roleDto: IRoleDto;
    saveCard: boolean;
    enablePush: boolean;
    accessToken: string;
    refreshToken: string;
    designation: string;
    profileImage: string | null;
    estateId: string ;
}

export interface ILoginResponse {
    message: string;
    statusCode: number;
    error: string | null;
    timestamp: string; // ISO 8601 date string
    data: IUserData;
}

export interface IRoleDto {
    name: string;
    description: string;
    dateCreated: string; 
    lastUpdated: string;
    permissionNames: string[];
    permissionsDto: any | null; 
}

export interface UserStatistics {
    totalUsersCount: number;
    activeUsersCount: number;
    inactiveUsersCount: number;
    landLordUsersCount: number;
    tenantUsersCount: number;
    occupantUsersCount: number;
}