import { FormikProps } from "formik";
import { FC } from "react";

interface GraduationProcessFormValues {
  student_id: string;
  modality_id: string;
  period: string;
  project_name: string;
}

interface SelectFieldProps {
  label: string;
  name: keyof GraduationProcessFormValues;
  options: Array<{
    id: number;
    name?: string;
    student_name?: string;
    value?: string;
  }>;
  formik: FormikProps<GraduationProcessFormValues>;
}

export const SelectField: FC<SelectFieldProps> = ({ label, name, options, formik }) => (
  <div className = "flex-1">
    <label className = "txt2">{label}</label>
    <select
      id = {name}
      name = {name}
      onChange = {formik.handleChange}
      value = {formik.values[name]}
      className = {`select-2 ${
        formik.touched[name] && formik.errors[name] ? "border-red-1" : "border-gray-300"
      }`}
    >
      <option value = "">{"Seleccione una opción"}</option>
      {options.map((option) => (
        <option key = {option.id} value = {option.id}>
          {option.name || option.student_name || option.value}
        </option>
      ))}
    </select>
    {formik.touched[name] && formik.errors[name] ? (
      <div className = "text-red-1 text-xs mt-1">{formik.errors[name]}</div>
    ) : (
      <div className = "h-5" />
    )}
  </div>
);

export default SelectField;