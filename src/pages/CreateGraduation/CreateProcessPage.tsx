import { useState, useCallback } from "react";
import FormContainer from "./components/FormContainer";
import ProcessForm from "./components/ProcessForm";

const CreateProcessPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  return (
    <FormContainer>
      <button onClick = {handleOpenModal}>{"Abrir proceso"}</button>
      <ProcessForm isVisible = {openModal} isClosed = {handleCloseModal} />
    </FormContainer>
  );
};

export default CreateProcessPage;
