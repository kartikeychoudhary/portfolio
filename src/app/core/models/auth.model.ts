/** Login request credentials */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Login response with token */
export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    role: 'admin';
    requiresPasswordChange?: boolean;
  };
}

/** Change password request */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Change password response */
export interface ChangePasswordResponse {
  message: string;
  user: LoginResponse['user'];
}
