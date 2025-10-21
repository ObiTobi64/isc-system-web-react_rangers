interface Role {
  id: number;
  name: string;
  disabled: boolean;
  permissions: string[];
}

export default Role;
