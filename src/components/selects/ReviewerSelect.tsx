import { FC } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import useReviewers from "../../hooks/useReviewers";
import Mentor from "../../models/mentorInterface";

interface ReviewerSelectProps {
  value: string;
  onChange: () => void;
  error?: boolean;
  helperText?: string | boolean;
  label?: string;
  name: string;
}

const ReviewerSelect: FC<ReviewerSelectProps> = ({
  value,
  onChange,
  error,
  helperText,
  label,
  name,
}) => {
  const { reviewers } = useReviewers();

  return (
    <FormControl
      fullWidth variant = "outlined" margin = "normal"
      error = {error}>
      <InputLabel id = {`${name}-label`}>{label || "Seleccione docente"}</InputLabel>
      <Select
        labelId = {`${name}-label`}
        id = {name}
        name = {name}
        value = {value}
        onChange = {onChange}
        label = {label || "Seleccione docente"}
      >
        <MenuItem value = "">
          <em>{"Seleccione un Docente"}</em>
        </MenuItem>
        {reviewers.map((option: Mentor) => (
          <MenuItem key = {option.id} value = {option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ReviewerSelect;
