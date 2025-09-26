import React, { useState, useCallback, useEffect } from "react";

import { TextField, Grid, Typography, MenuItem, Autocomplete, Modal, Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useFormik } from "formik";

import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { Student } from "../../../models/studentInterface";
import { getStudentsForGraduation } from "../../../services/studentService";
import { getModes } from "../../../services/modesService";
import { Modes } from "../../../models/modeInterface";
import { createGraduationProcess } from "../../../services/processServicer";
import { useProcessStore } from "../../../store/store";

interface ProcessFormProps {
  isVisible: boolean;
  isClosed: () => void;
}

function ProcessForm({ isVisible, isClosed }: ProcessFormProps) {
  const [, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [modes, setModes] = useState<Modes[]>([]);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const updateProcess = useProcessStore((state) => state.setProcess);
  const navigate = useNavigate();
  const actualDate = new Date();
  const numberPeriods = 3;

  const validationSchema = yup.object().shape({
    studentId: yup
      .number()
      .typeError("El ID del estudiante debe ser un número")
      .required("Campo requerido"),

    studentCode: yup
      .number()
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
      .typeError("El código del estudiante debe ser un número")
      .integer("El código debe ser un número entero")
      .positive("El código debe ser positivo")
      .required("Campo requerido"),

    modeId: yup
      .mixed()
      .test(
        "is-valid-mode",
        "Seleccionar Modalidad",
        (value) => typeof value === "number" && !Number.isNaN(value)
      ),

    period: yup.string().required("Campo requerido"),

    titleProject: yup
      .string()
      .min(5, "El título debe tener al menos 5 caracteres")
      .max(80, "El título no debe superar los 80 caracteres")
      .matches(/^[a-zA-Z0-9\s]+$/, "El título solo debe contener letras y números")
      .matches(/[a-zA-Z]/, "El título debe contener texto descriptivo.")
      .required("Campo requerido"),
  });

  const fetchData = useCallback(async () => {
    try {
      const responseStudents = await getStudentsForGraduation();
      const responseModes = await getModes();
      setModes(responseModes.data);
      setStudents([...responseStudents.data]);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
      setError("Failed to load data, please try again.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPeriods = (option: number) => {
    let firstSemester = actualDate.getMonth() <= 5;
    let currentYear = actualDate.getFullYear();
    const listPeriods = [];
    for (let i = 0; i < option; i += 1) {
      const strPeriod = firstSemester ? "Primero" : "Segundo";
      listPeriods.push(strPeriod + currentYear);
      if (!firstSemester) {
        currentYear += 1;
      }
      firstSemester = !firstSemester;
    }
    return listPeriods;
  };

  const formik = useFormik({
    initialValues: {
      studentId: "",
      studentCode: "",
      modeId: "",
      period: "",
      titleProject: "",
      stageId: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setTitleError(null);
      try {
        const response = await createGraduationProcess(values);
        if (response.success) {
          updateProcess(response.data);
          navigate(`/studentProfile/${response.data.id}`);
        }
      } catch (error) {
        console.error("Error al crear proceso:", error);

        setTitleError(
          "Este título ya ha sido registrado por otro estudiante. Por favor, ingrese un título diferente."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleStudentChange = (_event: React.ChangeEvent<object | null>, value: Student | null) => {
    formik.setFieldValue("studentId", value ? value.id : "");
    formik.setFieldValue("studentCode", value ? value.code : "");
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);
    if (titleError) {
      setTitleError(null);
    }
  };

  const isSubmitDisabled = loading || !!titleError || !formik.isValid;

  return (
    <Modal open={isVisible} onClose={isClosed}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "80%",
          maxWidth: "100vh",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: 2,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">{"Crear Proceso de Graduación"}</Typography>
              <Typography variant="body2" sx={{ fontSize: 14, color: "gray" }}>
                {
                  "Completa los siguientes campos para definir los criterios y requisitos del proceso de\r"
                }
                {"graduación.\r"}
              </Typography>
              <Divider flexItem sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="body2">{"Información Estudiante"}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Autocomplete
                    fullWidth
                    options={students}
                    getOptionLabel={(student) => `${student.name}`}
                    onChange={handleStudentChange}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nombre Estudiante"
                        variant="outlined"
                        margin="normal"
                        error={formik.touched.studentId && Boolean(formik.errors.studentId)}
                        helperText={formik.touched.studentId && formik.errors.studentId}
                      />
                    )}
                  />
                  <TextField
                    fullWidth
                    name="studentCode"
                    value={formik.values.studentCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.studentCode && Boolean(formik.errors.studentCode)}
                    helperText={formik.touched.studentCode && formik.errors.studentCode}
                    label="Código Estudiante"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Divider flexItem sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="body2">{"Información Modalidad"}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    select
                    label="Seleccionar Modalidad"
                    variant="outlined"
                    margin="normal"
                    name="modeId"
                    value={formik.values.modeId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.modeId && Boolean(formik.errors.modeId)}
                    helperText={formik.touched.modeId && formik.errors.modeId}
                  >
                    {modes.map((mode) => (
                      <MenuItem key={mode.id} value={mode.id}>
                        {mode.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Título de Proyecto"
                    name="titleProject"
                    value={formik.values.titleProject}
                    onChange={handleTitleChange}
                    onBlur={formik.handleBlur}
                    error={
                      (formik.touched.titleProject && Boolean(formik.errors.titleProject)) ||
                      Boolean(titleError)
                    }
                    helperText={
                      titleError || (formik.touched.titleProject && formik.errors.titleProject)
                    }
                    inputProps={{ maxLength: 80 }}
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    select
                    label="Seleccionar Período"
                    variant="outlined"
                    margin="normal"
                    name="period"
                    value={formik.values.period}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.period && Boolean(formik.errors.period)}
                    helperText={formik.touched.period && formik.errors.period}
                  >
                    {setPeriods(numberPeriods).map((value) => {
                      const desc = `${value.slice(0, value.length - 4)}-${value.slice(value.length - 4)}`;
                      return (
                        <MenuItem key={value} value={value}>
                          {desc}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
              </Grid>
              <Divider flexItem sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={loading}
                    disabled={isSubmitDisabled}
                  >
                    {"GUARDAR\r"}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default ProcessForm;
