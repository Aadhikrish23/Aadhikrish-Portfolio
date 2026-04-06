export interface UserData {
  name: string;
  email: string;
  updatedAt: string; 
}

export interface AuthResponse {
  user: UserData;   
  token: string;
}