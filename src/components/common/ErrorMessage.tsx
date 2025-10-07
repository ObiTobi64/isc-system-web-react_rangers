import { FC } from "react";

interface ErrorMessageProps {
  message: string;
  dataTestId?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, dataTestId }) => (
  <div data-test-id = {dataTestId} className = "text-red-1 text-xs font-medium mt-1">
    {message}
  </div>
);

export default ErrorMessage;