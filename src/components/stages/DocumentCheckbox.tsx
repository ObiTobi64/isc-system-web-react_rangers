import { FC, useState } from "react";
import { Checkbox, Paper, Typography } from "@mui/material";
import { FormikProps } from "formik";
import dayjs from "dayjs";
import DownloadButton from "../common/DownloadButton";
import letters from "../../constants/letters";
import { Seminar } from "../../models/studentProcess";
import { MentorFormValues } from "../../hooks/useMentorFormik";
import { Carrer } from "../../store/carrerStore";
import { Box } from "@mui/material";

const { TUTOR_APPROBAL, TUTOR_ASSIGNMENT } = letters;

interface DocumentCheckboxProps {
  disabled: boolean;
  formik: FormikProps<MentorFormValues>;
  carrer: Carrer | null;
  process: Seminar | null;
}

const DocumentCheckbox: FC<DocumentCheckboxProps> = ({ disabled, formik, carrer, process }) => {
  const [, setDownloadBlocked] = useState(false);

  const handleBlockedDownload = () => {
    if (!formik.values.mentor) {
      setDownloadBlocked(true);
    } else {
      setDownloadBlocked(false);
    }
  };

  const isMentorSelected = !!formik.values.mentor;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1.5,
          backgroundColor: "#e6f4ff",
          p: 2,
          borderRadius: 2,
          mt: 2,
        }}
      >
        <Checkbox
          name="tutorDesignationLetterSubmitted"
          color="primary"
          checked={formik.values.tutorDesignationLetterSubmitted}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {"Carta de Asignación de Tutor Presentada"}
        </Typography>
        <DownloadButton
          url={TUTOR_ASSIGNMENT.path}
          disabled={!isMentorSelected}
          onClick={handleBlockedDownload}
          data={{
            student: process?.student_fullname || "",
            tutor: process?.tutor_fullname || "",
            jefe_carrera: carrer?.headOfDepartment || "",
            carrera: carrer?.fullName || "",
            dia: dayjs().format("DD"),
            mes: dayjs().format("MMMM"),
            ano: dayjs().format("YYYY"),
          }}
          filename={`${TUTOR_ASSIGNMENT.filename}_${formik.values.mentorName}.${TUTOR_ASSIGNMENT.extention}`}
        />
      </Paper>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1.5,
          backgroundColor: "#e6f4ff",
          p: 2,
          borderRadius: 2,
          mt: 2,
        }}
      >
        <Checkbox
          name="tutorApprovalLetterSubmitted"
          color="primary"
          checked={formik.values.tutorApprovalLetterSubmitted}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {"Carta de Aprobación de Tutor Presentada"}
        </Typography>
        <Box
          sx={{
            minWidth: 0,
            width: { xs: "100%", sm: "auto" },
            "& .MuiButton-root": {
              maxWidth: { xs: "100%", sm: 260 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              px: 1.5,
            },
          }}
        >
          <DownloadButton
            url={TUTOR_APPROBAL.path}
            disabled={!isMentorSelected}
            onClick={handleBlockedDownload}
            data={{
              student: process?.student_fullname || "",
              tutor: process?.tutor_fullname || "",
              jefe_carrera: carrer?.headOfDepartment || "",
              degree: process?.tutor_degree || "",
              carrera: carrer?.fullName || "",
              dia: dayjs().format("DD"),
              mes: dayjs().format("MMMM"),
              ano: dayjs().format("YYYY"),
              title_project: process?.project_name || "",
              date: dayjs(formik.values.date_tutor_assignament).format("DD/MM/YYYY"),
              isTesis: process?.modality_id.toString() === "3" ? "  X" : "",
              isProject: process?.modality_id.toString() === "1" ? "  X" : "",
              isJob: process?.modality_id.toString() === "2" ? "  X" : "",
            }}
            filename={`${TUTOR_APPROBAL.filename}_${formik.values.mentorName}.${TUTOR_APPROBAL.extention}`}
          />
        </Box>
      </Paper>
    </>
  );
};

export default DocumentCheckbox;
