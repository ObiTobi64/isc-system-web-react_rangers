/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import Role from './roleInterface';

export interface RoleTableProps {
  roles: Role[];
  selectedRole: string;
  onRoleSelect: (roleName: string) => void;
  setIsModalVisible: any;
}
