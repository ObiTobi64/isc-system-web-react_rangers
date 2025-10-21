/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { FC, useCallback } from "react";
import { Grid } from "@mui/material";
import { FormikProps } from "formik";
import ProfessorAutocomplete from "../selects/ProfessorAutoComplete";
import { Seminar } from "../../models/studentProcess";
import { MentorFormValues } from "../../hooks/useMentorFormik";
import Mentor from "../../models/mentorInterface";

interface MentorSelectionProps {
  disabled: boolean;
  formik: FormikProps<MentorFormValues>;
  process: Seminar | null;
  renderFieldError: (fieldName: string) => JSX.Element | null;
  onProcessUpdate?: (updatedProcess: Seminar) => void;
}

const MentorSelection: FC<MentorSelectionProps> = ({
  disabled,
  formik,
  process,
  renderFieldError,
  onProcessUpdate,
}) => {
  const handleMentorChange = useCallback(
    (_event: unknown, value: Mentor | null) => {
      formik.setFieldValue("mentor", value?.id || "");
      formik.setFieldValue("mentorName", value?.name || "");

      if (process && value) {
        const updatedProcess = {
          ...process,
          tutor_fullname: value.fullname || "",
        };

        if (onProcessUpdate) {
          onProcessUpdate(updatedProcess);
        }
      }
    },
    [formik, process, onProcessUpdate]
  );

  return (
    <Grid item xs = {6} mt = {5}>
      <ProfessorAutocomplete
        disabled = {disabled}
        value = {String(formik.values.mentor)}
        onChange = {handleMentorChange}
        id = "mentor"
        label = "Seleccionar Tutor"
      />
      {renderFieldError("mentor")}
    </Grid>
  );
};

export default MentorSelection;
