import { FC } from "react";
import { Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormikProps } from "formik";
import { MentorFormValues } from "../../hooks/useMentorFormik";
import dayjs from 'dayjs';

interface DateSelectionProps {
  disabled: boolean;
  formik: FormikProps<MentorFormValues>;
  renderFieldError: (fieldName: string) => JSX.Element | null;
}

const currentDate = dayjs();

const DateSelection: FC<DateSelectionProps> = ({ disabled, formik, renderFieldError }) => {
  return (
    <Grid item xs={6} mt={5}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disabled={disabled}
          label="Fecha de Asignación"
          value={formik.values.date_tutor_assignament ? dayjs(formik.values.date_tutor_assignament):null}
          onChange={(value) => formik.setFieldValue("date_tutor_assignament", value)}
          format="DD/MM/YYYY"
          minDate={currentDate}
          maxDate={currentDate.add(1,'year')}
        />
      </LocalizationProvider>
      {renderFieldError("date_tutor_assignament")}
    </Grid>
  );
};

export default DateSelection;
