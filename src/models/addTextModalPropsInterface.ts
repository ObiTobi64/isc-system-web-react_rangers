/* eslint-disable no-unused-vars */
import Role from './roleInterface';

interface AddTextModalProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onCreate: (name: string, category: string) => void;
  existingRoles: Role[];
}

export default AddTextModalProps;
