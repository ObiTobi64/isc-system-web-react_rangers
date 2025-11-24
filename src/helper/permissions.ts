/* eslint-disable camelcase */
import Permission from '../models/permissionInterface';
import { useUserStore } from '../store/store';

function HasPermission(permissionName: string): boolean {
  const user = useUserStore((state) => state.user);
  let hasThePermission = false;
  if (user) {
    Object.keys(user.roles_permissions).forEach((role_number: string) => {
      const rolePermissions = user.roles_permissions[role_number];
      rolePermissions?.permissions.forEach((permission: Permission) => {
        if (permissionName.toLowerCase() === permission.name.toLowerCase()) {
          hasThePermission = true;
        }
      });
    });
  }
  return hasThePermission;
}

export default HasPermission;
