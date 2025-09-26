import { FC, useCallback, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Box, Button, Typography, Grid, Alert, AlertTitle } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import WarningIcon from "@mui/icons-material/Warning";

import MentorSelection from "./MentorSelection";
import DateSelection from "./DateSelection";
import DocumentCheckbox from "./DocumentCheckbox";
import LoadingBackdrop from "../common/LoadingBackdrop";
import ConfirmModal from "../common/ConfirmModal";
import { steps } from "../../data/steps";
import { useProcessStore } from "../../store/store";
import { updateProcess } from "../../services/processServicer";
import { useCarrerStore } from "../../store/carrerStore";
import useMentorFormik from "../../hooks/useMentorFormik";
import { STAGE } from "../../constants/stages";

const CURRENT_STAGE = STAGE.MENTOR;

interface InternalDefenseStageProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const MentorStage: FC<InternalDefenseStageProps> = ({ onPrevious, onNext }) => {
  const process = useProcessStore((state) => state.process);
  const carrer = useCarrerStore((state) => state.carrer);
  const setProcess = useProcessStore((state) => state.setProcess);

  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(CURRENT_STAGE < (process?.stage_id || 0));
  const isBlocked = process?.stage_id !== 2;

  const { formik, canApproveStage } = useMentorFormik(process, () => {
    if (canApproveStage) {
      setShowModal(true);
    } else {
      saveStage();
    }
  });

  const saveStage = useCallback(async () => {
    if (!process) return;

    setLoading(true);

    const { mentor, mentorName, tutorDesignationLetterSubmitted, date_tutor_assignament } =
      formik.values;

    const updatedProcess = {
      ...process,
      tutor_letter: tutorDesignationLetterSubmitted,
      tutor_approval: formik.values.tutorApprovalLetterSubmitted,
      tutor_id: Number(mentor),
      tutor_name: mentorName,
      date_tutor_assignament: date_tutor_assignament ? dayjs(date_tutor_assignament) : null,
      ...(canApproveStage && {
        stage_id: 2,
        tutor_approval: true,
        tutor_approval_date: dayjs(),
      }),
    };
    try {
      await updateProcess(updatedProcess);
      setProcess(updatedProcess);
      if (canApproveStage) {
        onNext();
      }
    } catch (error) {
      console.error("Error updating process:", error);
    } finally {
      setLoading(false);
    }
  }, [process, formik.values, setProcess, onNext, canApproveStage]);

  const handleModalAction = useCallback(() => {
    saveStage();
    setShowModal(false);
  }, [saveStage]);

  const renderFieldError = (fieldName: string) => {
    const touched = formik.touched[fieldName as keyof typeof formik.touched];
    const error = formik.errors[fieldName as keyof typeof formik.errors];
    return touched && error ? (
      <Typography color="error" variant="caption">
        {String(error)}
      </Typography>
    ) : null;
  };

  const editForm = () => {
    setEditMode(false);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
        Etapa 2: Seleccionar Tutor
        {!isBlocked && <ModeEditIcon onClick={editForm} style={{ cursor: "pointer" }} />}
      </Typography>

      {isBlocked && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <AlertTitle>{"Fase de Tutor Registrada"}</AlertTitle>
          {"Esta fase ya ha sido completada y aprobada. No se puede editar el tutor porque \r"}
          {"la fase ya ha sido registrada. Si necesita hacer cambios, contacte al administrador.\r"}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit} className="mx-16">
        <Grid container spacing={3}>
          <MentorSelection
            disabled={editMode}
            formik={formik}
            process={process}
            renderFieldError={renderFieldError}
          />
          <DateSelection disabled={editMode} formik={formik} renderFieldError={renderFieldError} />
        </Grid>
        <DocumentCheckbox disabled={editMode} formik={formik} carrer={carrer} process={process} />
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button type="button" onClick={onPrevious} variant="contained" color="secondary">
            Anterior
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {canApproveStage ? "Aprobar Etapa" : "Guardar"}
          </Button>
        </Box>
      </form>
      {showModal && (
        <ConfirmModal
          step={steps[1]}
          nextStep={steps[2]}
          isApproveButton={canApproveStage}
          setShowModal={setShowModal}
          onNext={handleModalAction}
        />
      )}
      <LoadingBackdrop loading={loading} canApproveStage={canApproveStage} />
    </>
  );
};
