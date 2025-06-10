import { FC, useState, useCallback } from "react";
import { Box, Button, Checkbox, Grid, Paper, Typography } from "@mui/material";
import ConfirmModal from "../common/ConfirmModal";
import { steps } from "../../data/steps";
import { useProcessStore } from "../../store/store";
import { updateProcess } from "../../services/processServicer";
import { Mentor } from "../../models/mentorInterface";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ProfessorAutocomplete from "../selects/ProfessorAutoComplete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DownloadButton from "../common/DownloadButton";
import { letters } from "../../constants/letters";
import { useCarrerStore } from "../../store/carrerStore";
import useReviewerFormik from "../../hooks/useReviewerFormik";
const { TUTOR_APPROBAL, REVIEWER_ASSIGNMENT } = letters;

const program = "Ingeniería de Sistemas Computacionales";
const headOfDepartment = "Alexis Marechal Marin PhD";
const CURRENT_STAGE = 2;

interface ReviewerStageProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const ReviewerStage: FC<ReviewerStageProps> = ({ onPrevious, onNext }) => {
  const process = useProcessStore((state) => state.process);
  const carrer = useCarrerStore((state) => state.carrer);
  const setProcess = useProcessStore((state) => state.setProcess);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(CURRENT_STAGE < (process?.stage_id || 0));

  const { formik, canApproveStage } = useReviewerFormik(process, () => {
    if (canApproveStage()) {
      setShowModal(true);
    } else {
      saveStage(false);
    }
  });

  const saveStage = useCallback(
    async (approve: boolean) => {
      if (process) {
        const {
          reviewer,
          reviewerDesignationLetterSubmitted,
          reviewerApprovalLetterSubmitted,
          date_reviewer_assignament,
        } = formik.values;

        const updatedProcess = {
        ...process,
        reviewer_approval: reviewerApprovalLetterSubmitted,
        reviewer_letter: reviewerDesignationLetterSubmitted,
        reviewer_id: Number(reviewer),
        date_reviewer_assignament: date_reviewer_assignament
          ? dayjs(date_reviewer_assignament).toISOString()
          : "",
        };
        
        if (approve) {
          updatedProcess.stage_id = 3;
          updatedProcess.reviewer_approval_date = dayjs().toISOString();
        }

        setProcess({ ...process, ...updatedProcess});
        try {
          await updateProcess(process);
          if (approve) {
            onNext();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [process, formik.values, setProcess, onNext]
  );

  const handleModalAction = useCallback(() => {
    saveStage(true);
    setShowModal(false);
  }, [saveStage]);

  const handleMentorChange = (_event: React.ChangeEvent<unknown>, value: Mentor | null) => {
    formik.setFieldValue("reviewer", value?.id || "");
    if (process) {
      process.reviewer_fullname = value?.fullname || "";
    }
  };

  const handleDateChange = (value: Dayjs | null) => {
    formik.setFieldValue("date_reviewer_assignament", value);
  };

  const isApproveButton = canApproveStage();

  const editForm = () => {
    setEditMode(false);
  };

  return (
    <>
      <div className="txt1 pb-3">
        Etapa 3: Seleccionar Revisor <ModeEditIcon onClick={editForm} />
      </div>

      <form onSubmit={formik.handleSubmit} className="mt-5 mx-16">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <ProfessorAutocomplete
              disabled={editMode}
              value={String(formik.values.reviewer)}
              onChange={handleMentorChange}
              id="reviewer"
              label={"Seleccionar Revisor"}
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
                value={
                  formik.values.date_reviewer_assignament
                    ? dayjs(formik.values.date_reviewer_assignament)
                    : null
                }
                onChange={handleDateChange}
                format="DD/MM/YYYY"
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
            Carta de Designación de Revisor Presentada
          </Typography>
          <DownloadButton
            url={REVIEWER_ASSIGNMENT.path}
            data={{
              student: process?.student_fullname || "",
              number: 1,
              reviewer: process?.reviewer_fullname || "",
              degree: process?.reviewer_degree || "",
              jefe_carrera: headOfDepartment,
              carrera: carrer?.fullName || "",
              project_title: process?.project_name || "",
              carrer_abre: carrer?.shortName || "",
              day: dayjs().format("DD"),
              month: dayjs().format("MMMM"),
              year: dayjs().format("YYYY"),
            }}
            filename={`${REVIEWER_ASSIGNMENT.filename}_${process?.reviewer_fullname || ""
              }.${REVIEWER_ASSIGNMENT.extention}`}
          />
          {formik.touched.reviewerDesignationLetterSubmitted &&
            formik.errors.reviewerDesignationLetterSubmitted ? (
            <div className="text-red-1 text-xs mt-1">
              {formik.errors.reviewerDesignationLetterSubmitted}
            </div>
          ) : null}
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
            Carta de Aprobación de Revisor Presentada
          </Typography>
          <DownloadButton
            url={TUTOR_APPROBAL.path}
            data={{
              student: process?.student_name || "",
              tutor: process?.tutor_name || "",
              jefe_carrera: headOfDepartment,
              carrera: program,
              dia: dayjs().format("DD"),
              mes: dayjs().format("MMMM"),
              ano: dayjs().format("YYYY"),
              title_project: process?.project_name || "",
              date: dayjs(formik.values.date_reviewer_assignament).format("DD/MM/YYYY"),
            }}
            filename={`${TUTOR_APPROBAL.filename}_${formik.values.reviewer}.${TUTOR_APPROBAL.extention}`}
          />
          {formik.touched.reviewerApprovalLetterSubmitted &&
            formik.errors.reviewerApprovalLetterSubmitted ? (
            <div className="text-red-1 text-xs mt-1">
              {formik.errors.reviewerApprovalLetterSubmitted}
            </div>
          ) : null}
        </Paper>
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button type="button" variant="contained" color="secondary" onClick={onPrevious}>
            Anterior
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              !formik.values.reviewerDesignationLetterSubmitted ||
              !formik.values.reviewerApprovalLetterSubmitted
            }
          >
            {isApproveButton ? "Aprobar Etapa" : "Guardar"}
          </Button>
        </Box>
      </form>
      {showModal && (
        <ConfirmModal
          step={steps[2]}
          nextStep={steps[3]}
          setShowModal={setShowModal}
          isApproveButton={isApproveButton}
          onNext={handleModalAction}
        />
      )}
    </>
  );
};