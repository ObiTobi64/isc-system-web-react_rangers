/* eslint-disable no-unused-vars */
import Role from './roleInterface';

interface RoleComponentProps {
  role: Role;
  selectedRole: string;
  onRoleClick: (roleName: string) => void;
  onDelete: (id: number) => void;
  onEdited: (id: number, role: { name: string }) => void;
}

export default RoleComponentProps;
