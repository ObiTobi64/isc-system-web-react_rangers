/* eslint-disable no-unused-vars */
export interface DeleteRoleModalProps {
  roleName: string;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  onDelete: () => void;
}
