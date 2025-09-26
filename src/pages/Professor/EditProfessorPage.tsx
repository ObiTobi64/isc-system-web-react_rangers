import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Divider, Grid, TextField, Typography, Snackbar, Alert, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { updateProfessor, getProfessorById } from "../../services/mentorsService";
import {
  PHONE_ERROR_MESSAGE,
  PHONE_DIGITS,
  LETTERS_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  CODE_ERROR_MESSAGE,
  CODE_DIGITS,
  CODE_MIN_DIGITS,
  CODE_REGEX,
} from "../../constants/validation";

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(LETTERS_REGEX, "El nombre solo debe contener letras")
    .required("El nombre completo es obligatorio"),
  lastname: Yup.string()
    .matches(LETTERS_REGEX, "El apellido paterno solo debe contener letras")
    .required("El apellido es obligatorio"),
  mothername: Yup.string()
    .matches(LETTERS_REGEX, "El apellido materno solo debe contener letras")
    .required("El apellido materno es obligatorio"),
  email: Yup.string()
    .matches(EMAIL_REGEX, "Ingrese un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  phone: Yup.string()
    .matches(PHONE_REGEX, PHONE_ERROR_MESSAGE)
    .required("El número de teléfono es obligatorio"),
  degree: Yup.string().required("El título académico es obligatorio"),
  code: Yup.string()
    .matches(CODE_REGEX, CODE_ERROR_MESSAGE)
    .required("El código de docente es obligatorio"),
  
});

interface EditProfessorProps {
  id: number;
}

const EditProfessorPage = ({ id }:EditProfessorProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [, setProfessor] = useState<any>();
  const fetchProfessor = async () => {
    try {
      const response = await getProfessorById(id);
      formik.setValues({
        ...response,
        lastname: response.lastName,
        mothername: response.motherName,
        roles: [2], 
        role_id: 2,
        isStudent: false,
        is_scholarship: false,
      });
      setProfessor(response);
    } catch (error) {
      console.error("Error al obtener docente:", error);
    }
  };

  useEffect(() => {
    fetchProfessor();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      code: "",
      mothername: "",
      degree: "",
      roles: [3],
      role_id: 3,
      isStudent: false,
      is_scholarship: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedValues = {
          name: values.name,
          lastname: values.lastname,
          mothername: values.mothername,
          email: values.email,
          phone: values.phone,
          code: values.code, // Como string
          degree: values.degree,
          role_id: 2,
          roles: [2],
          isStudent: false,
          is_scholarship: false
        };
        
        // @ts-ignore
        await updateProfessor({
          id: Number(id),
          ...updatedValues
        });
        setMessage("Docente actualizado con éxito");
        setSeverity("success");
      } catch (error) {
        setMessage("Error al actualizar");
        setSeverity("error");
      } finally {
        setOpen(true);
      }
    },
  });
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

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
      formik.setFieldTouched("code", true);
    }
  };
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h4">Editar Docente</Typography>
            <Typography variant="body2" sx={{ fontSize: 14, color: "gray" }}>
              Ingrese los datos del docente a continuación.
            </Typography>
            <Divider flexItem sx={{ mt: 2, mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ padding: 2 }}>
              <Grid item xs={3}>
                <Typography variant="h6">Información del Docente</Typography>
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="name"
                      name="name"
                      label="Nombres"
                      variant="outlined"
                      fullWidth
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="lastname"
                      name="lastname"
                      label="Apellido Paterno"
                      variant="outlined"
                      fullWidth
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
                      id="mothername"
                      name="mothername"
                      label="Apellido Materno"
                      variant="outlined"
                      fullWidth
                      value={formik.values.mothername}
                      onChange={formik.handleChange}
                      error={formik.touched.mothername && Boolean(formik.errors.mothername)}
                      helperText={formik.touched.mothername && formik.errors.mothername}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="code"
                      name="code"
                      label="Codigo de Docente"
                      variant="outlined"
                      fullWidth
                      value={formik.values.code}
                      onChange={handleCodeChange}
                      error={formik.touched.code && Boolean(formik.errors.code)}
                      helperText={formik.touched.code && formik.errors.code}
                      margin="normal"
                      inputProps={{ 
                        maxLength: CODE_DIGITS,
                        minLength: CODE_MIN_DIGITS
                      }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  id="degree"
                  name="degree"
                  label="Título Académico"
                  variant="outlined"
                  fullWidth
                  select
                  value={formik.values.degree}
                  onChange={formik.handleChange}
                  error={formik.touched.degree && Boolean(formik.errors.degree)}
                  helperText={formik.touched.degree && formik.errors.degree}
                  margin="normal"
                >
                  <MenuItem value="">Seleccione un título</MenuItem>
                  <MenuItem value="Ing.">Ing.</MenuItem>
                  <MenuItem value="M.Sc.">M.Sc.</MenuItem>
                  <MenuItem value="PhD.">PhD.</MenuItem>
                  <MenuItem value="M.Eng.">M.Eng.</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Divider flexItem sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ padding: 2 }}>
              <Grid item xs={3}>
                <Typography variant="h6">Información Adicional</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  id="email"
                  name="email"
                  label="Correo Electrónico"
                  variant="outlined"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                  inputProps={{ maxLength: 50 }}
                />
                <TextField
                  id="phone"
                  name="phone"
                  label="Número de Teléfono"
                  variant="outlined"
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
          </Grid>
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
      <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  };
export default EditProfessorPage;
