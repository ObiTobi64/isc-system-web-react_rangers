import React, { FC, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Grid, Button, Typography } from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import ConfirmModal from "../common/ConfirmModal";
import { steps } from "../../data/steps";
import pdfFile from "../../assets/Acta_Defensa_Interna_de_Seminario_de_Grado_V1.1.pdf";
import { modifyPdf, PDFInsertData } from "../../utils/pdfEditor";
import { downloadFile } from "../../utils/files";
import { useProcessStore } from "../../store/store";
import { postDefenseDetail } from "../../services/defenseDetail";
import { updateProcess } from "../../services/processServicer";
import { useDefenseInternalDetail } from "../../hooks/useDefenseInternalDetail";
import ProfessorAutocomplete from "../selects/ProfessorAutoComplete";
import { Mentor } from "../../models/mentorInterface";
import EmailSender from "../common/EmailArea";
import { getProfessorById } from "../../services/mentorsService";

const DEFENSE_INTERNAL = "internal";

interface InternalValues {
  president: string;
  firstJuror: string;
  secondJuror: string;
  date: Dayjs | null;
}

interface InternalDefenseStageProps {
  onPrevious: () => void;
  onNext: () => void;
}

const currentDate = dayjs();

const InternalDefenseStage: FC<InternalDefenseStageProps> = ({ onPrevious, onNext }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(true);

  const process = useProcessStore((state) => state.process);
  const setProcess = useProcessStore((state) => state.setProcess);
  const defenseDetail = useDefenseInternalDetail(process?.id || 0);
  const [subStage, setSubStage] = useState<number>(0);

  const formik = useFormik({
    initialValues: {
      president: defenseDetail?.president?.toString() || "",
      firstJuror: defenseDetail?.first_juror?.toString() || process?.tutor_id?.toString() || "",
      secondJuror:
        defenseDetail?.second_juror?.toString() || process?.reviewer_id?.toString() || "",
      date: defenseDetail?.date ? dayjs(defenseDetail.date) : null,
    },
    validationSchema: Yup.object({
      president: Yup.string().required("* Debe agregar un presidente"),
      firstJuror: Yup.string().required("* Debe agregar un primer jurado"),
      secondJuror: Yup.string().required("* Debe agregar un segundo jurado"),
      date: Yup.mixed()
        .nullable()
        .required("* Debe seleccionar una fecha")
        .test("is-valid", "* Fecha no válida", (value) => dayjs.isDayjs(value) && value.isValid()),
    }),
    onSubmit: () => {
      setShowModal(true);
    },
  });

  useEffect(() => {
    if (defenseDetail) {
      formik.setValues({
        president: defenseDetail.president?.toString() || "",
        firstJuror: defenseDetail.first_juror?.toString() || process?.tutor_id?.toString() || "",
        secondJuror:
          defenseDetail.second_juror?.toString() || process?.reviewer_id?.toString() || "",
        date: defenseDetail.date ? dayjs(defenseDetail.date) : null,
      });
    }
  }, [defenseDetail]);

  const handleDateChange = (value: Dayjs | null) => {
    formik.setFieldValue("date", value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadEditedPDF = async (values: any) => {
    try {
      const [year, month, day, hour, minute] = values.date.format("YYYY-MM-DD HH:mm").split(/[- :]/);
      const response = await getProfessorById(parseInt(values.president));
      const fullName = response.fullname;
      const student = process?.student_fullname || "";
      const tutor = `${process?.tutor_degree || ""} ${process?.tutor_fullname}`;
      const reviewer = `${process?.reviewer_degree || ""} ${process?.reviewer_fullname}`;
      const projectName = process?.project_name;

      const data: PDFInsertData[] = [
        { x: 195, y: 204.1, size: 10, text: `${day}` },
        { x: 222, y: 204.1, size: 10, text: `${month}` },
        { x: 245, y: 204.1, size: 10, text: `${year}` },
        { x: 195, y: 228, size: 10, text: hour },
        { x: 222, y: 228, size: 10, text: minute },
        { x: 222, y: 250, size: 10, text: student },
        { x: 222, y: 293, size: 10, text: fullName },
        { x: 222, y: 317, size: 10, text: tutor },
        { x: 222, y: 340, size: 10, text: reviewer },
        { x: 305, y: 369, size: 10, text: projectName },

      ];
      

      const pdfArrayBuffer = await fetch(pdfFile).then((res) => res.arrayBuffer());
      const modifiedPdf = await modifyPdf(pdfArrayBuffer, data);
      const pdfBlob = new Blob([modifiedPdf], { type: "application/pdf" });

      downloadFile(pdfBlob, "Acta_Defensa_Interna_de_Seminario_de_Grado_V1.1.pdf");
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const saveStage = async (values: InternalValues) => {
    if (process) {
      const defensePayload = {
        graduation_process_id: process.id,
        president: Number(values.president),
        first_juror: Number(values.firstJuror),
        second_juror: Number(values.secondJuror),
      };
      await postDefenseDetail(process.id, {
        ...defensePayload,
        type: DEFENSE_INTERNAL,
      });
      process.stage_id = 4;
      setProcess(process);
      await updateProcess(process);
      onNext();
    }
  };

  const handleModalAction = async () => {
    if (formik.values) {
      await saveStage(formik.values);
      await downloadEditedPDF(formik.values);
      setShowModal(false);
    }
  };

  const handlePresidentChange = (_event: React.ChangeEvent<unknown>, value: Mentor | null) => {
    formik.setFieldValue("president", value?.id || "");
  };

  const handleFirstJurorChange = (_event: React.ChangeEvent<unknown>, value: Mentor | null) => {
    formik.setFieldValue("firstJuror", value?.id || "");
  };

  const handleSecondJurorChange = (_event: React.ChangeEvent<unknown>, value: Mentor | null) => {
    formik.setFieldValue("secondJuror", value?.id || "");
  };

  const canApproveStage = () =>
    Boolean(
      formik.values.president &&
      formik.values.firstJuror &&
      formik.values.secondJuror &&
      formik.values.date
    );

  const isApproveButton = canApproveStage();

  const editForm = () => {
    setReadOnly(false);
  };

  const nextSubStage = () => {
    setSubStage(subStage + 1);
  };

  const prevSubStage = () => {
    if (subStage === 0) {
      onPrevious();
    } else {
      setSubStage(subStage - 1);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
        {"Etapa 4: Defensa Interna"}{" "}
        {subStage === 1 && <ModeEditIcon onClick={editForm} style={{ cursor: "pointer" }} />}
      </Typography>
      {subStage === 0 && (
        <>
          <EmailSender />
          <Box display="flex" justifyContent="space-between" pt={1} pb={0}>
            <Button type="button" onClick={prevSubStage} variant="contained" color="secondary">
              {"Anterior"}
            </Button>
            <Button onClick={nextSubStage} variant="contained" color="primary">
              {"Siguiente"}
            </Button>
          </Box>
        </>
      )}
      {subStage === 1 && (
        <form onSubmit={formik.handleSubmit} className="mx-16">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6} marginTop={5}>
                <ProfessorAutocomplete
                  disabled={readOnly}
                  value={String(formik.values.president)}
                  onChange={handlePresidentChange}
                  id="president"
                  label="Seleccionar Presidente"
                />
                {formik.touched.president && formik.errors.president ? (
                  <div className="text-red-1 text-xs mt-1">{String(formik.errors.president)}</div>
                ) : null}
              </Grid>

              <Grid item xs={6} marginTop={5}>
                <ProfessorAutocomplete
                  disabled={readOnly}
                  value={String(formik.values.firstJuror)}
                  onChange={handleFirstJurorChange}
                  id="firstJuror"
                  label="Seleccionar Primer Jurado"
                />
                {formik.touched.firstJuror && formik.errors.firstJuror ? (
                  <div className="text-red-1 text-xs mt-1">{String(formik.errors.firstJuror)}</div>
                ) : null}
              </Grid>

              <Grid item xs={6} marginTop={5}>
                <ProfessorAutocomplete
                  disabled={readOnly}
                  value={String(formik.values.secondJuror)}
                  onChange={handleSecondJurorChange}
                  id="secondJuror"
                  label="Seleccionar Segundo Jurado"
                />
                {formik.touched.secondJuror && formik.errors.secondJuror ? (
                  <div className="text-red-1 text-xs mt-1">{String(formik.errors.secondJuror)}</div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6} marginTop={5}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disabled={readOnly}
                    label="Fecha de Defensa"
                    value={formik.values.date}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    minDate={currentDate}
                    maxDate={currentDate.add(1, "year")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        onBlur: () => formik.setFieldTouched("date", true),
                        error: formik.touched.date && Boolean(formik.errors.date),
                        helperText: formik.touched.date && formik.errors.date,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>

          <Box display="flex" justifyContent="space-between" pt={5}>
            <Button type="button" onClick={prevSubStage} variant="contained" color="secondary">
              {"Anterior"}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isApproveButton ? "Aprobar Etapa" : "Guardar"}
            </Button>
          </Box>
        </form>
      )}
      {showModal && (
        <ConfirmModal
          step={steps[3]}
          nextStep={steps[4]}
          isApproveButton={isApproveButton}
          setShowModal={setShowModal}
          onNext={handleModalAction}
        />
      )}
    </>
  );
};

export default InternalDefenseStage;
