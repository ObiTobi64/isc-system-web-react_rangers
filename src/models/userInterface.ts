import Role from './roleInterface';

export interface User {
  id: number;
  username: string;
  name: string;
  lastname: string;
  mothername: string;
  password: string;
  email: string;
  code: string;
  phone: string;
  degree: string;
  roles: string[];
  rolesAndPermissions?: { [id: number]: Role };
}

export interface UserRequest {
  name: string;
  lastname: string;
  mothername: string;
  username?: string;
  email: string;
  code: string;
  phone: string;
  degree: string;
  roles: number[];
  role_id: number;
  isStudent: boolean;
  is_scholarship: boolean;
}
