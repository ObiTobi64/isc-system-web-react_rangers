import Permission from './permissionInterface';

interface PermissionsCategory {
  [name: string]: [permissions: Permission[]];
}

export default PermissionsCategory;
