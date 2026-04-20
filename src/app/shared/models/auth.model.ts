export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  profilId: number;
}

export interface CurrentUser {
  token: string;
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  profilId: number;
}