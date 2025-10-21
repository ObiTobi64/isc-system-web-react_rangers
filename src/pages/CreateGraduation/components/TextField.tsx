import { FormikProps } from "formik";
import { FC } from "react";

interface GraduationProcessFormValues {
  student_id: string;
  modality_id: string;
  period: string;
  project_name: string;
}

interface TextFieldProps {
  label: string;
  name: keyof GraduationProcessFormValues;
  formik: FormikProps<GraduationProcessFormValues>;
}
export const TextField: FC<TextFieldProps> = ({ label, name, formik }) => (
  <div className = "flex-1">
    <label className = "txt2">{label}</label>
    <input
      type = "text"
      id = {name}
      name = {name}
      onChange = {formik.handleChange}
      value = {formik.values[name]}
      placeholder = {`Ingrese ${label.toLowerCase()}`}
      className = {`select-2 ${
        formik.touched[name] && formik.errors[name] ? "border-red-1" : "border-gray-300"
      }`}
    />
    {formik.touched[name] && formik.errors[name] ? (
      <div className = "text-red-1 text-xs mt-1">{formik.errors[name]}</div>
    ) : (
      <div className = "h-5" />
    )}
  </div>
);

export default TextField;
