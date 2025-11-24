import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getUserById, updateStudent } from "../../services/studentService";

import {
  PHONE_ERROR_MESSAGE,
  CODE_DIGITS,
  PHONE_DIGITS,
  LETTERS_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  CODE_REGEX,
} from "../../constants/validation";
import FormContainer from "../CreateGraduation/components/FormContainer";

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
    .matches(EMAIL_REGEX, "Ingrese un correo electrónico válido")
    .max(50, "Máximo 50 caracteres")
    .required("El correo electrónico es obligatorio"),

  phone: Yup.string()
    .matches(PHONE_REGEX, PHONE_ERROR_MESSAGE)
    .required("El número de teléfono es obligatorio"),

  code: Yup.string()
    .matches(CODE_REGEX, `El código debe tener hasta ${CODE_DIGITS} dígitos`)
    .required("El código de estudiante es obligatorio"),
});

const EditStudentPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const { id } = useParams();

  const fetchStudent = async () => {
    try {
      const response = await getUserById(Number(id));

      const roleMapping: { [key: number]: string } = {
        1: "admin",
        2: "teacher",
        3: "student",
      };

      response.role = response.rolesAndPermissions
        ? Object.values(response.rolesAndPermissions)
          .map((rp) => (rp as { role_name: string }).role_name)
          .join(", ")
        : roleMapping[response.role_id] || "No role found";

      if (response.role.includes("student")) {
        formik.setValues(response);
      } else {
        setMessage("No tienes permiso para editar este usuario.");
        setSeverity("error");
        setOpen(true);
        setTimeout(() => navigate("/students"), 3000);
      }
    } catch (error) {
      setMessage("Error al cargar los datos del estudiante.");
      setSeverity("error");
      setOpen(true);
      setTimeout(() => navigate("/students"), 3000);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      code: "",
      mothername: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { role, ...dataToSend } = values;
        await updateStudent(dataToSend);
        setMessage("Estudiante actualizado con éxito");
        setSeverity("success");
        setOpen(true);
      } catch (error) {
        setMessage("Error al crear el estudiante");
        setSeverity("error");
        setOpen(true);
      }
    },
  });

  const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^[0-9]*$/.test(value)) {
      formik.setFieldValue("phone", value);
    }
  };

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^[0-9]*$/.test(value)) {
      formik.setFieldValue("code", value);
    }
  };

  return (
    <div style = {{ position: "relative" }}>
      <IconButton
        onClick = {() => window.history.back()}
        aria-label = "back"
        style = {{
          position: "absolute",
          top: "-5px",
          left: "-20px",
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <FormContainer>
        <form onSubmit = {formik.handleSubmit}>
          <Grid container spacing = {2} sx = {{ padding: 2 }}>
            <Grid item xs = {12}>
              <Typography variant = "h4">{"Crear Nuevo Estudiante"}</Typography>
              <Typography variant = "body2" sx = {{ fontSize: 14, color: "gray" }}>
                {"Ingrese los datos del estudiante a continuación.\r"}
              </Typography>
              <Divider flexItem sx = {{ mt: 2, mb: 2 }} />
            </Grid>

            <Grid item xs = {12}>
              <Grid container spacing = {2} sx = {{ padding: 2 }}>
                <Grid item xs = {3}>
                  <Typography variant = "h6">{"Información del Estudiante"}</Typography>
                </Grid>
                <Grid item xs = {9}>
                  <Grid container spacing = {2}>
                    <Grid item xs = {6}>
                      <TextField
                        id = "name"
                        name = "name"
                        label = "Nombres"
                        variant = "outlined"
                        fullWidth
                        value = {formik.values.name}
                        onChange = {formik.handleChange}
                        error = {formik.touched.name && Boolean(formik.errors.name)}
                        helperText = {formik.touched.name && formik.errors.name}
                        margin = "normal"
                        inputProps = {{ maxLength: 20 }}
                      />
                    </Grid>
                    <Grid item xs = {6}>
                      <TextField
                        id = "lastname"
                        name = "lastname"
                        label = "Apellido Paterno"
                        variant = "outlined"
                        fullWidth
                        value = {formik.values.lastname}
                        onChange = {formik.handleChange}
                        error = {formik.touched.lastname && Boolean(formik.errors.lastname)}
                        helperText = {formik.touched.lastname && formik.errors.lastname}
                        margin = "normal"
                        inputProps = {{ maxLength: 20 }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing = {2}>
                    <Grid item xs = {6}>
                      <TextField
                        id = "mothername"
                        name = "mothername"
                        label = "Apellido Materno"
                        variant = "outlined"
                        fullWidth
                        value = {formik.values.mothername}
                        onChange = {formik.handleChange}
                        error = {formik.touched.mothername && Boolean(formik.errors.mothername)}
                        helperText = {formik.touched.mothername && formik.errors.mothername}
                        margin = "normal"
                        inputProps = {{ maxLength: 20 }}
                      />
                    </Grid>
                    <Grid item xs = {6}>
                      <TextField
                        id = "code"
                        name = "code"
                        label = "Codigo de Estudiante"
                        variant = "outlined"
                        fullWidth
                        value = {formik.values.code}
                        onChange = {handleCodeChange}
                        error = {formik.touched.code && Boolean(formik.errors.code)}
                        helperText = {formik.touched.code && formik.errors.code}
                        margin = "normal"
                        inputProps = {{ maxLength: CODE_DIGITS }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Divider flexItem sx = {{ my: 2 }} />
            </Grid>

            <Grid item xs = {12}>
              <Grid container spacing = {2} sx = {{ padding: 2 }}>
                <Grid item xs = {3}>
                  <Typography variant = "h6">{"Información Adicional"}</Typography>
                </Grid>
                <Grid item xs = {9}>
                  <TextField
                    id = "email"
                    name = "email"
                    label = "Correo Electrónico"
                    variant = "outlined"
                    fullWidth
                    value = {formik.values.email}
                    onChange = {formik.handleChange}
                    error = {formik.touched.email && Boolean(formik.errors.email)}
                    helperText = {formik.touched.email && formik.errors.email}
                    margin = "normal"
                    inputProps = {{ maxLength: 50 }}
                  />
                  <TextField
                    id = "phone"
                    name = "phone"
                    label = "Número de Teléfono"
                    variant = "outlined"
                    fullWidth
                    value = {formik.values.phone}
                    onChange = {handlePhoneChange}
                    error = {formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText = {formik.touched.phone && formik.errors.phone}
                    margin = "normal"
                    inputProps = {{ maxLength: PHONE_DIGITS }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs = {12}>
              <Grid container spacing = {2} justifyContent = "flex-end">
                <Grid item>
                  <Button variant = "contained" color = "primary" type = "submit">
                    {"GUARDAR\r"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          open = {open}
          autoHideDuration = {6000}
          onClose = {handleClose}
          anchorOrigin = {{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose = {handleClose} severity = {severity} sx = {{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </FormContainer>
    </div>
  );
};

export default EditStudentPage;
