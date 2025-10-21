import { User } from './userInterface';

interface UserFormProps {
  handleClose: () => void;
  openCreate: boolean;
  user: User | null;
}

export default UserFormProps;
