/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState, useCallback, ChangeEvent } from "react";
import { Autocomplete, TextField } from "@mui/material";
import Mentor from "../../models/mentorInterface";
import { getMentors } from "../../services/mentorsService";

interface ProfessorAutocompleteProps {
  value: string;
   // eslint-disable-next-line no-unused-vars
   onChange: (event: ChangeEvent<unknown>, value: Mentor | null) => void;
  disabled?: boolean;
  id: string;
  label: string;
}

const ProfessorAutocomplete: FC<ProfessorAutocompleteProps> = ({
  value,
  onChange,
  disabled,
  id,
  label,
}) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await getMentors();
      setMentors(response.data);
    } catch (e) {
      setError("Error getting mentors");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getOptionLabel = useCallback((option: Mentor) => option.fullname, []);

  const renderInput = useCallback(
    (params: any) => (
      <TextField
        {...params} label = {label} error = {Boolean(error)}
        helperText = {error} />
    ),
    [label, error]
  );

  return (
    <Autocomplete
      disabled = {disabled}
      id = {id}
      options = {mentors}
      getOptionLabel = {getOptionLabel}
      value = {mentors.find((mentor) => mentor.id === Number(value)) || null}
      onChange = {onChange}
      renderInput = {renderInput}
    />
  );
};

export default ProfessorAutocomplete;
