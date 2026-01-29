export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  lastLogin?: string;
}

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  provider: 'google';
  idToken: string;
}
