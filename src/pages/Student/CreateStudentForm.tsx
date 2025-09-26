import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Container,
} from "@mui/material";
import { createStudent } from "../../services/studentService";
import { createIntern } from "../../services/internService";
import axios from "axios";
import SuccessDialog from "../../components/common/SucessDialog";
import ErrorDialog from "../../components/common/ErrorDialog";
import {
  PHONE_ERROR_MESSAGE,
  CODE_ERROR_MESSAGE,
  CODE_DIGITS,
  CODE_MIN_DIGITS,
  PHONE_DIGITS,
  LETTERS_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  CODE_REGEX,
} from "../../constants/validation";

const validationSchema = Yup.object({
  name: Yup.string()
    .max(20, "Máximo 20 caracteres")
    .matches(LETTERS_REGEX, "Solo letras y espacios")
    .required("El nombre completo es obligatorio"),

  lastname: Yup.string()
    .max(20, "Máximo 20 caracteres")
    .matches(LETTERS_REGEX, "Solo letras y espacios")
    .required("El apellido paterno es obligatorio"),

  mothername: Yup.string()
    .max(20, "Máximo 20 caracteres")
    .matches(LETTERS_REGEX, "Solo letras y espacios")
    .required("El apellido materno es obligatorio"),

  email: Yup.string()
    .matches(EMAIL_REGEX,"Ingrese un correo electrónico válido")
    .max(50, "Máximo 50 caracteres")
    .required("El correo electrónico es obligatorio"),

  phone: Yup.string()
    .matches(PHONE_REGEX, PHONE_ERROR_MESSAGE)
    .required("El número de teléfono es obligatorio"),

  code: Yup.string()
    .matches(CODE_REGEX, CODE_ERROR_MESSAGE)
    .required("El código de estudiante es obligatorio"),

  isIntern: Yup.boolean(),

  total_hours: Yup.number()
    .min(0, "Las horas no pueden ser negativas.")
    .when("isIntern",{
      is: true,
      then: (schema) => schema.required("Las horas becarias son obligatorias."),
      otherwise: (schema) => schema.nullable(),
    }),
});

const CreateStudentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      mothername: "",
      email: "",
      phone: "",
      code: "",
      isIntern: false,
      total_hours: 0,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const { isIntern, total_hours, ...rest } = values;
        const studentData = isIntern
          ? {
              ...rest,
              is_scholarship: true,
              total_hours,
              completed_hours: 0,
              pending_hours: total_hours,
            }
          : {
              ...rest,
              is_scholarship: false,
            };

        if (isIntern) {
          await createIntern({
            ...rest,
            total_hours,
            completed_hours: 0,
            pending_hours: 0,
          } as any);
        } else {
          await createStudent({
            ...studentData,
            // Mantener como string
            code: rest.code,
          });
        }
        setSuccessDialog(true);
        setTimeout(() => {
          onSuccess();
          resetForm();
        }, 2000);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const backendMessage = error?.response?.data?.error;
          setMessage(backendMessage || "Error al crear estudiante");
        } else {
          setMessage("Error inesperado. Por favor, inténtelo de nuevo.");
        }
        setErrorDialog(true);
      }
    },
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9]*$/.test(value)) {
      formik.setFieldValue("phone", value);
    }
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9]*$/.test(value)) {
      formik.setFieldValue("code", value);
    }
  };

  return (
    <Container>
      <form onSubmit={formik.handleSubmit} style={{ marginLeft: -20}}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h4">Crear Nuevo Estudiante</Typography>
            <Typography variant="body2" sx={{ fontSize: 14, color: "gray" }}>
              Ingrese los datos del estudiante a continuación.
            </Typography>
            <Divider flexItem sx={{ mt: 2, mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">Información del Estudiante</Typography>
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="name"
                      label="Nombres"
                      fullWidth
                      inputProps={{ maxLength: 20 }}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="lastname"
                      label="Apellido Paterno"
                      fullWidth
                      inputProps={{ maxLength: 20 }}
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                      helperText={formik.touched.lastname && formik.errors.lastname}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="mothername"
                      label="Apellido Materno"
                      fullWidth
                      inputProps={{ maxLength: 20 }}
                      value={formik.values.mothername}
                      onChange={formik.handleChange}
                      error={formik.touched.mothername && Boolean(formik.errors.mothername)}
                      helperText={formik.touched.mothername && formik.errors.mothername}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                  <TextField
                      name="code"
                      label="Código de Estudiante"
                      fullWidth
                      value={formik.values.code}
                      onChange={handleCodeChange}
                      margin="normal"
                      error={formik.touched.code && Boolean(formik.errors.code)}
                      helperText={formik.touched.code && formik.errors.code}
                      inputProps={{ 
                        maxLength: CODE_DIGITS,
                        minLength: CODE_MIN_DIGITS
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider flexItem sx={{ mt: 2, mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">Información Adicional</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  name="email"
                  label="Correo Electrónico"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  inputProps={{ maxLength: 50 }}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                />
                <TextField
                  name="phone"
                  label="Número de Teléfono"
                  fullWidth
                  value={formik.values.phone}
                  onChange={handlePhoneChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  margin="normal"
                  inputProps={{ maxLength: PHONE_DIGITS }}
                />
              </Grid>
            </Grid>
            <Divider flexItem sx={{ mt: 2, mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ padding: 0 }}>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isIntern}
                      onChange={(e) => formik.setFieldValue("isIntern", e.target.checked)}
                      name="isIntern"
                    />
                  }
                  label=<Typography variant="body2">¿Es Becario?</Typography>
                />
              </Grid>
            </Grid>
          </Grid>

          {formik.values.isIntern && (
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ padding: 0 }}>
                <Grid item xs={6}>
                  <TextField
                    name="total_hours"
                    label="Horas Becario"
                    type="number"
                    fullWidth
                    value={formik.values.total_hours}
                    onChange={formik.handleChange}
                    error={formik.touched.total_hours && Boolean(formik.errors.total_hours)}
                    helperText={formik.touched.total_hours && formik.errors.total_hours}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  GUARDAR
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <SuccessDialog
        open={successDialog}
        onClose={() => setSuccessDialog(false)}
        title="¡Estudiante Creado!"
        subtitle="El estudiante ha sido creado con éxito."
      />
      <ErrorDialog
        open={errorDialog}
        onClose={() => setErrorDialog(false)}
        title="¡Vaya!"
        subtitle={message}
      />
    </Container>
  );
};

export default CreateStudentForm;
