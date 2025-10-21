import axios from 'axios';
import apiClient from './apiInstance';
import { UserResponse } from './models/LoginResponse';

const authenticateUser = async (email: string, password: string): Promise<UserResponse> => {
  try {
    const response = await apiClient.get('/login', {
      params: { email, password },
    });

    if (!response.data.length) {
      throw new Error('Credenciales inválidas');
    }

    const loginData = response.data[0];

    const userRes = await apiClient.get('/users', {
      params: { email: loginData.email },
    });

    if (!userRes.data.length) {
      throw new Error('Usuario no encontrado');
    }

    const user = userRes.data[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rolesPermissions: Record<string, { role_name: string; permissions: any[] }> = {};

    await Promise.all(
      user.roles.map(async (roleName: string) => {
        const roleRes = await apiClient.get('/roles', {
          params: { roleName },
        });

        const role = roleRes.data[0];
        const roleId = role?.id ?? 0;

        const permissionsRes = await apiClient.get('/permissions', {
          params: { subtitle_like: roleName },
        });

        const permissions: Permissions[] = permissionsRes.data?.flatMap(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) => p.permissions || []
        );

        rolesPermissions[roleId] = {
          role_name: roleName,
          permissions,
        };
      })
    );

    const result: UserResponse = {
      id: user.id,
      username: user.name.toLowerCase(),
      name: user.name,
      lastname: user.lastname,
      mothername: user.mothername,
      email: user.email,
      phone: user.phone,
      role_id: loginData.user?.role_id ?? 0,
      roles: user.roles,
      roles_permissions: rolesPermissions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      code: user.code,
      token: loginData.token,
    };

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error de red');
    } else {
      throw new Error('Ocurrió un error inesperado');
    }
  }
};

export default authenticateUser;
