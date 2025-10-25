import { FC, useState, useEffect, ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Tooltip,
  Typography,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import ConfirmModal from "../common/ConfirmModal";
import steps from "../../data/steps";
import { useProcessStore } from "../../store/store";
import { updateProcess } from "../../services/processServicer";
import Mentor from "../../models/mentorInterface";
import ProfessorAutocomplete from "../selects/ProfessorAutoComplete";
import DownloadButton from "../common/DownloadButton";
import letters from "../../constants/letters";
import { useCarrerStore } from "../../store/carrerStore";

const parseEnvNumber = (v: unknown, d: number) => {
  const n = Number(v as any);
  return Number.isFinite(n) ? n : d;
};

const PAST_MONTHS = parseEnvNumber(import.meta?.env?.VITE_STAGE3_DATE_PAST_MONTHS, 12);
const FUTURE_MONTHS = parseEnvNumber(import.meta?.env?.VITE_STAGE3_DATE_FUTURE_MONTHS, 6);

const NOW = dayjs();
const MIN_DATE = NOW.subtract(PAST_MONTHS, "month");
const MAX_DATE = NOW.add(FUTURE_MONTHS, "month");

const { TUTOR_APPROBAL, REVIEWER_ASSIGNMENT } = letters;

const validationSchema = Yup.object({
  reviewer: Yup.string()
    .required("* El revisor es obligatorio")
    .test(
      "different-from-tutor",
      "* El revisor no puede ser el mismo docente que el tutor",
      function (value) {
        const { parent } = this;
        const { tutorId } = parent as { tutorId?: number | string };
        return !value || !tutorId || value !== tutorId.toString();
      }
    ),
  date_reviewer_assignament: Yup.mixed<Dayjs>()
    .nullable()
    .required("* La fecha de asignación es obligatoria")
    .test(
      "min-range",
      () => `* La fecha no puede ser anterior a ${MIN_DATE.format("DD/MM/YYYY")}`,
      (value) => {
        return !!value && (value.isSame(MIN_DATE, "day") || value.isAfter(MIN_DATE));
      }
    )
    .test(
      "max-range",
      () => `* La fecha no puede ser posterior a ${MAX_DATE.format("DD/MM/YYYY")}`,
      (value) => {
        return !!value && (value.isSame(MAX_DATE, "day") || value.isBefore(MAX_DATE));
      }
    ),
  reviewerDesignationLetterSubmitted: Yup.boolean(),
  reviewerApprovalLetterSubmitted: Yup.boolean(),
});

interface ReviewerStageProps {
  onPrevious: () => void;
  onNext: () => void;
}

const CURRENT_STAGE = 2;

const ReviewerStage: FC<ReviewerStageProps> = ({ onPrevious, onNext }) => {
  const process = useProcessStore((state) => state.process);
  const carrer = useCarrerStore((state) => state.carrer);
  const setProcess = useProcessStore((state) => state.setProcess);

  const [showErrorSnackbar, setShowErrorSnackbar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showWarningSnackbar, setShowWarningSnackbar] = useState<boolean>(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const isReadOnlyMode = (): boolean => {
    if (!process) {
      return true;
    }
    return process.stage_id > CURRENT_STAGE && !!process.reviewer_approval;
  };

  const [editMode, setEditMode] = useState<boolean>(isReadOnlyMode());

  const wasReviewerApproved = (): boolean =>
    Boolean(process?.reviewer_approval && process?.stage_id > CURRENT_STAGE);

  const [currentReviewerId, setCurrentReviewerId] = useState<string>(
    process?.reviewer_id?.toString() || ""
  );

  const isDuplicateSelection = (reviewerId?: string): boolean => {
    const tutorId = process?.tutor_id;
    const selectedReviewer = reviewerId || currentReviewerId;
    return Boolean(tutorId && selectedReviewer && tutorId.toString() === selectedReviewer);
  };

  const formik = useFormik({
    initialValues: {
      reviewerDesignationLetterSubmitted: process?.reviewer_letter || false,
      date_reviewer_assignament: process?.date_reviewer_assignament
        ? dayjs(process.date_reviewer_assignament)
        : dayjs(),
      reviewer: process?.reviewer_id?.toString() || "",
      reviewerApprovalLetterSubmitted: process?.reviewer_approval || false,
      tutorId: process?.tutor_id,
    },
    validationSchema,
    onSubmit: () => {
      if (isDuplicateSelection(formik.values.reviewer)) {
        setShowDuplicateWarning(true);
        return;
      }

      if (canApproveStage()) {
        setShowModal(true);
      } else {
        saveStage(false);
      }
    },
  });

  useEffect(() => {
    if (process) {
      const reviewerId = process.reviewer_id?.toString() || "";
      setCurrentReviewerId(reviewerId);
      formik.setValues({
        reviewerDesignationLetterSubmitted: process.reviewer_letter || false,
        date_reviewer_assignament: process.date_reviewer_assignament
          ? dayjs(process.date_reviewer_assignament)
          : dayjs(),
        reviewer: reviewerId,
        reviewerApprovalLetterSubmitted: process.reviewer_approval || false,
        tutorId: process.tutor_id,
      });
      setEditMode(isReadOnlyMode());
    }
  }, [process]);

  const canApproveStage = (): boolean =>
    Boolean(
      formik.values.reviewer &&
        formik.values.reviewerDesignationLetterSubmitted &&
        formik.values.reviewerApprovalLetterSubmitted &&
        formik.values.date_reviewer_assignament &&
        !isDuplicateSelection(formik.values.reviewer)
    );
  const isApproveButton = canApproveStage();
  const hasReviewer = Boolean(formik.values.reviewer);

  const handleErrorSnackbarClose = (): void => {
    setShowErrorSnackbar(false);
  };

  const saveStage = async (shouldAdvanceStage: boolean = false): Promise<void> => {
    if (!process || isSaving) return;

    setIsSaving(true);

    try {
      const { reviewer, reviewerDesignationLetterSubmitted, reviewerApprovalLetterSubmitted } =
        formik.values;

      const updatedProcess = {
        ...process,
        reviewer_letter: reviewerDesignationLetterSubmitted,
        reviewer_approval:
          Number(reviewer) !== process.reviewer_id
            ? false
            : reviewerApprovalLetterSubmitted,
        reviewer_id: Number(reviewer),
        date_reviewer_assignament: formik.values.date_reviewer_assignament,
      };

      if (shouldAdvanceStage && isApproveButton) {
        updatedProcess.stage_id = 3;
        updatedProcess.reviewer_approval_date = dayjs();
      }

      await updateProcess(updatedProcess);
      setProcess(updatedProcess);

      if (shouldAdvanceStage && isApproveButton) {
        onNext();
      }
    } catch (error) {
      console.error("Error saving stage:", error);
      setErrorMessage("Error al guardar los datos. Por favor, intente nuevamente.");
      setShowErrorSnackbar(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalAction = async (): Promise<void> => {
    await saveStage(true);
    setShowModal(false);
  };

  const handleMentorChange = (_event: ChangeEvent<unknown>, value: Mentor | null): void => {
    const selectedId = value?.id?.toString() || "";

    if (selectedId && process?.tutor_id && selectedId === process.tutor_id.toString()) {
      setShowDuplicateWarning(true);
      return;
    }

    setCurrentReviewerId(selectedId);
    formik.setFieldValue("reviewer", selectedId);
    if (process) {
      process.reviewer_fullname = value?.fullname || "";
    }
  };

  const handleDateChange = (value: Dayjs | null): void => {
    formik.setFieldValue("date_reviewer_assignament", value);
  };

  const editForm = (): void => {
    if (wasReviewerApproved()) {
      setShowWarningSnackbar(true);
      return;
    }
    setEditMode(false);
  };

  const handleWarningSnackbarClose = (): void => {
    setShowWarningSnackbar(false);
  };

  const handleDuplicateWarningClose = (): void => {
    setShowDuplicateWarning(false);
  };

  return (
    <>
      <div className="txt1 pb-3">
        {"Etapa 3: Seleccionar Revisor "}
        <ModeEditIcon
          onClick={editForm}
          style={{
            cursor: wasReviewerApproved() ? "not-allowed" : "pointer",
            color: wasReviewerApproved() ? "#ccc" : "inherit",
          }}
        />
      </div>

      {wasReviewerApproved() && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <AlertTitle>{"Fase de Revisor Registrada"}</AlertTitle>
          {"Esta fase ya ha sido completada y aprobada. No se puede editar el revisor porque \r"}
          {"la fase ya ha sido registrada. Si necesita hacer cambios, contacte al administrador.\r"}
        </Alert>
      )}

      {!wasReviewerApproved() &&
        process?.reviewer_approval &&
        process?.stage_id > CURRENT_STAGE && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>{"Edición de Revisor Aprobado"}</AlertTitle>
            {
              "El revisor actual ya fue aprobado. Cualquier cambio requerirá una nueva aprobación \r"
            }
            {"y el proceso regresará a la etapa de revisión.\r"}
          </Alert>
        )}

      {isDuplicateSelection(formik.values.reviewer) && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<ErrorIcon />}>
          <AlertTitle>{"Docente Duplicado"}</AlertTitle>
          {"El docente seleccionado ya está asignado como tutor. Por favor, seleccione un \r"}
          {"docente diferente para el rol de revisor.\r"}
        </Alert>
      )}

      {process?.tutor_fullname && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>{"Tutor Asignado"}</AlertTitle>
          {"Tutor actual: "}
          <strong>
            {process.tutor_degree} {process.tutor_fullname}
          </strong>
          <br />
          <em>{"Recuerde que el revisor debe ser un docente diferente al tutor."}</em>
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit} className="mt-5 mx-16">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <ProfessorAutocomplete
              disabled={editMode}
              value={formik.values.reviewer}
              onChange={handleMentorChange}
              id="reviewer"
              label="Seleccionar Revisor"
            />
            {formik.touched.reviewer && formik.errors.reviewer ? (
              <div className="text-red-1 text-xs mt-1">{formik.errors.reviewer}</div>
            ) : null}
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disabled={editMode}
                label="Fecha de Asignación"
                value={formik.values.date_reviewer_assignament}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                minDate={MIN_DATE}
                maxDate={MAX_DATE}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#e6f4ff",
            p: 2,
            borderRadius: 2,
            mt: 2,
          }}
        >
          <Checkbox
            name="reviewerDesignationLetterSubmitted"
            color="primary"
            checked={formik.values.reviewerDesignationLetterSubmitted}
            onChange={formik.handleChange}
            disabled={editMode}
          />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {"Carta de Designación de Revisor Presentada\r"}
          </Typography>
          <Tooltip
            title={!hasReviewer ? "Debe seleccionar un revisor para habilitar esta descarga" : ""}
          >
            <span>
              <DownloadButton
                disabled={!hasReviewer}
                url={REVIEWER_ASSIGNMENT.path}
                data={{
                  student: process?.student_fullname || "",
                  number: 1,
                  reviewer: process?.reviewer_fullname || "",
                  degree: process?.reviewer_degree || "",
                  jefe_carrera: carrer?.headOfDepartment || "",
                  carrera: carrer?.fullName || "",
                  project_title: process?.project_name || "",
                  carrer_abre: carrer?.shortName || "",
                  day: dayjs().format("DD"),
                  month: dayjs().format("MMMM"),
                  year: dayjs().format("YYYY"),
                }}
                filename={`${REVIEWER_ASSIGNMENT.filename}_${process?.reviewer_fullname || ""}.${REVIEWER_ASSIGNMENT.extention}`}
              />
            </span>
          </Tooltip>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#e6f4ff",
            p: 2,
            borderRadius: 2,
            mt: 2,
          }}
        >
          <Checkbox
            name="reviewerApprovalLetterSubmitted"
            color="primary"
            checked={formik.values.reviewerApprovalLetterSubmitted}
            onChange={formik.handleChange}
            disabled={editMode}
          />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {"Carta de Aprobación de Revisor Presentada\r"}
          </Typography>
          <Tooltip
            title={!hasReviewer ? "Debe seleccionar un revisor para habilitar esta descarga" : ""}
          >
            <span>
              <DownloadButton
                disabled={!hasReviewer}
                url={TUTOR_APPROBAL.path}
                data={{
                  student: process?.student_fullname || "",
                  tutor: process?.reviewer_fullname || "",
                  jefe_carrera: carrer?.headOfDepartment || "",
                  degree: process?.reviewer_degree || "",
                  carrera: carrer?.fullName || "",
                  dia: dayjs().format("DD"),
                  mes: dayjs().format("MMMM"),
                  ano: dayjs().format("YYYY"),
                  title_project: process?.project_name || "",
                  date: dayjs(formik.values.date_reviewer_assignament).format("DD/MM/YYYY"),
                  isTesis: process?.modality_id.toString() === "3" ? "  X" : "",
                  isProject: process?.modality_id.toString() === "1" ? "  X" : "",
                  isJob: process?.modality_id.toString() === "2" ? "  X" : "",
                }}
                filename={`${TUTOR_APPROBAL.filename}_${process?.reviewer_fullname || formik.values.reviewer}.${TUTOR_APPROBAL.extention}`}
              />
            </span>
          </Tooltip>
        </Paper>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button type="button" variant="contained" color="secondary" onClick={onPrevious}>
            {"Anterior\r"}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              editMode ||
              !formik.values.reviewerDesignationLetterSubmitted ||
              !formik.values.reviewerApprovalLetterSubmitted ||
              Boolean(isDuplicateSelection(formik.values.reviewer)) ||
              isSaving
            }
          >
            {isSaving ? "Guardando..." : isApproveButton ? "Aprobar Etapa" : "Guardar"}
          </Button>
        </Box>
      </form>

      {showModal && (
        <ConfirmModal
          step={steps[2]}
          nextStep={steps[3]}
          setShowModal={() => setShowModal(false)}
          isApproveButton={isApproveButton}
          onNext={handleModalAction}
        />
      )}

      <Snackbar
        open={showWarningSnackbar}
        autoHideDuration={6000}
        onClose={handleWarningSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleWarningSnackbarClose} severity="warning" sx={{ width: "100%" }}>
          {"No se puede editar el revisor porque la fase ya ha sido registrada o aprobada.\r"}
          {"Cualquier cambio requerirá reiniciar el proceso de aprobación.\r"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showDuplicateWarning}
        autoHideDuration={8000}
        onClose={handleDuplicateWarningClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleDuplicateWarningClose} severity="error" sx={{ width: "100%" }}>
          <AlertTitle>{"Docente Duplicado"}</AlertTitle>
          {"No se puede asignar el mismo docente como tutor y revisor. \r"}
          {"Por favor, seleccione un docente diferente.\r"}
        </Alert>
      </Snackbar>
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleErrorSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleErrorSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReviewerStage;
