import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/system";
import * as yup from "yup";
import { useCarrerStore } from "../../store/carrerStore";
import { sendEmail } from "../../services/emailService";
import { useProcessStore } from "../../store/store";
import { getUserById } from "../../services/usersService";

const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

interface StudentProcess {
  student_fullname?: string;
  student_code?: string;
  student_phone?: string;
  student_email?: string;
  modality_name?: string;
}

const emailSchema = yup.object().shape({
  subject: yup
    .string()
    .min(10, "El asunto debe tener al menos 10 caracteres")
    .required("El asunto es obligatorio"),
  emailContent: yup
    .string()
    .test("len", "El cuerpo debe tener al menos 20 caracteres", (value) => {
      const plainText = stripHtml(value || "");
      return plainText.trim().length >= 20;
    })
    .required("El cuerpo es obligatorio"),
});

const Root = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 800,
  margin: "auto",
  marginTop: theme.spacing(5),
}));

const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const generateEmailContent = (studentProcess: StudentProcess): string => `
  <p><strong><u>${studentProcess?.student_fullname?.toUpperCase() || "ALUMNO"}</u></strong></p>
  <p><strong>Nombre:</strong> ${studentProcess?.student_fullname || "-"}</p>
  <p><strong>Código:</strong> ${studentProcess?.student_code || "-"}</p>
  <p><strong>Celular:</strong> ${studentProcess?.student_phone || "-"}</p>
  <p><strong>Email:</strong> <a href="mailto:${studentProcess?.student_email}">${studentProcess?.student_email || "-"}</a></p>
  <p><strong>Modalidad:</strong> ${studentProcess?.modality_name || "-"}</p>
`;

const EmailSender = () => {
  const process = useProcessStore((state) => state.process);
  const carrer = useCarrerStore((state) => state.carrer);
  const [emailSent, setEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [subject, setSubject] = useState(
    `Revision de Carpeta - ${carrer?.shortName} - ${process?.student_fullname}`
  );
  const defaultEmailContent = `
    <p><strong><u>ALUMNO 1</u></strong></p>
    <p><strong>Nombre:</strong> ${process?.student_fullname}</p>
    <p><strong>Código:</strong> ${process?.student_code}</p>
    <p><strong>Celular:</strong> ${process?.student_phone}</p>
    <p><strong>Email:</strong> <a href="mailto:${process?.student_email}">${process?.student_email}</a></p>
    <p><strong>Modalidad:</strong> ${process?.modality_name}</p>
  `;
  const [emailContent, setEmailContent] = useState(defaultEmailContent);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!process?.student_id) {
        return;
      }

      try {
        const response = await getUserById(process.student_id);
        const student = response.data;

        setEmailContent(
          generateEmailContent({
            ...process,
            student_email: student.email,
            student_phone: student.phone,
            student_code: student.code,
          })
        );
      } catch (err) {
        console.error("Error al obtener datos del estudiante:", err);
      }
    };

    fetchStudentInfo();
  }, []);

  const handleEmailContentChange = (content: string) => {
    setEmailContent(content);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setError("");
    try {
      await emailSchema.validate({ subject, emailContent });
      const response = await sendEmail({
        email: process?.student_email || "",
        subject,
        textHtml: emailContent,
      });
      if (!response.success) {
        throw new Error("Error al enviar el correo");
      }
      setEmailSent(true);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Error al enviar el correo");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Root>
      <TextField
        label="Asunto"
        variant="outlined"
        fullWidth
        margin="normal"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <ReactQuill
        value={emailContent}
        onChange={handleEmailContentChange}
        theme="snow"
        modules={quillModules}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {emailSent && (
        <Typography color="success" variant="body2" sx={{ mt: 2 }}>
          {"Correo enviado exitosamente"}
        </Typography>
      )}
      {!emailSent && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSendEmail}
          disabled={isSending}
        >
          {isSending ? "Enviando..." : "Enviar Correo"}
        </Button>
      )}
    </Root>
  );
};

export default EmailSender;
