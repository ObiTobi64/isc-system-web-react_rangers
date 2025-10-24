import { useCallback, FC, Dispatch, SetStateAction, useState } from "react";

interface ConfirmModalProps {
  step: string;
  nextStep: string;
  isApproveButton: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>> | (() => void);
  onNext: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const { step, nextStep, setShowModal, onNext } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await onNext();
    } finally {
      setIsLoading(false);
    }
  }, [onNext, isLoading]);

  const handleCancel = useCallback(() => {
    if (!isLoading && setShowModal) {
      setShowModal(false);
    }
  }, [setShowModal, isLoading]);

  return (
    <div className = "flex absolute items-center justify-center inset-0 bg-gradient-to-tr from-[#39414E]/90 from-40% via-50% to-[#39414E]/95 to-55% via-[#272F3C]/90 z-50 bg-opacity-55">
      <div className = "flex flex-col justify-center bg-white m-5 p-5 shadow-md rounded-lg h-fit lg:w-1/3 md:w-1/2 sm:w-1/2">
        <label className = "txt-modal">
          {"Finalizando etapa: "}
          {step}
        </label>
        <label className = "txt2-modal">
          {"¿Está seguro de continuar a la siguiente etapa de "}
          {nextStep}
          {"?\r"}
        </label>
        <label className = "txt3-modal">{"No podrá modificar los datos una vez que continue"}</label>
        <div className = "flex flex-row justify-between w-full px-5 md:px-2">
          <button onClick = {handleContinue} className = "btn" disabled = {isLoading}>
            {"Continuar\r"}
          </button>
          <button onClick = {handleCancel} className = "btn2-cancel" disabled = {isLoading}>
            {"Cancelar\r"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
