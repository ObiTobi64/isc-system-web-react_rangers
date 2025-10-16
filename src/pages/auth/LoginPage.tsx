import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authenticateUser } from "../../services/authService";
import LogoUPB from "../../assets/upb_logo.png";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import SpinModal from "../../components/common/SpinModal";
import { useUserStore } from "../../store/store";
import { roles } from "../../constants/roles";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { ADMIN, PROFESSOR, STUDENT, INTERN, PROGRAM_DIRECTOR, SUPERVISOR } = roles;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo electrónico inválido").required("El correo es requerido"),
      password: Yup.string()
        .min(6, "Debe tener al menos 6 caracteres")
        .required("El password es requerido"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setIsLoading(true);
      try {
        const isAuthenticated = await authenticateUser(values.email, values.password);
        if (isAuthenticated) {
          const dashboardInterns = [INTERN, SUPERVISOR];
          const dashboardProcess = [ADMIN, STUDENT, PROFESSOR, PROGRAM_DIRECTOR];
          localStorage.setItem("token", isAuthenticated.token);
          setUser(isAuthenticated);
          localStorage.setItem(
            "sessionActive",
            JSON.stringify({
              userId: isAuthenticated.id,
              active: true,
            })
          );
          if (isAuthenticated.roles.some((role) => dashboardProcess.includes(role))) {
            navigate("/dashboard");
          }
          if (isAuthenticated.roles.some((role) => dashboardInterns.includes(role))) {
            navigate("/scholarshipHours");
          }
        } else {
          setError("Credenciales incorrectas");
        }
      } catch (e) {
        setError("Credenciales incorrectas");
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  return isLoading ? (
    <SpinModal />
  ) : (
    <section className = "h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0 ">
      <div className = "md:w-1/3 max-w-sm mr-10">
        <img src = {LogoUPB} alt = "UPB Logo" />
      </div>
      <div className = "md:w-1/3 max-w-sm">
        <form onSubmit = {formik.handleSubmit}>
          <input
            data-test-id = "email-login"
            className = "text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
            type = "text"
            placeholder = "Correo Electronico"
            name = "email"
            onChange = {formik.handleChange}
            onBlur = {formik.handleBlur}
            value = {formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <ErrorMessage dataTestId = "error-message-email" message = {formik.errors.email} />
          ) : null}
          <input
            data-test-id = "password-login"
            className = "text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type = "password"
            placeholder = "Password"
            name = "password"
            onChange = {formik.handleChange}
            onBlur = {formik.handleBlur}
            value = {formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <ErrorMessage dataTestId = "error-message-password" message = {formik.errors.password} />
          ) : null}
          {error && (
            <div data-test-id = "error-message-credentials" className = "text-red-500">
              {error}
            </div>
          )}
          <div className = "text-center md:text-center">
            <button
              data-test-id = "login-button"
              className = "mt-4 bg-primary hover:bg-blue-700 px-10 py-3 text-white uppercase rounded text-sm md:text-base tracking-wider"
              type = "submit"
              disabled = {formik.isSubmitting || isLoading}
            >
              {isLoading ? "Cargando..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
