import Permission from '../../models/permissionInterface';

export interface LoginResponse {
  token: string;
  id: number;
  roles: string[];
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  lastname: string;
  mothername: string;
  email: string;
  phone: string;
  role_id: number;
  roles: string[];
  roles_permissions: {
    [roleNumber: string]: {
      role_name: string;
      permissions: Permission[];
    };
  };
  created_at: string;
  updated_at: string;
  code: string;
  token: string;
}
