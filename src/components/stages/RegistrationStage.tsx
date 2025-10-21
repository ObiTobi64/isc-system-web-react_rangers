import { FC, useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modes from "../../models/modeInterface";
import getModes from "../../services/modesService";
import { Modal } from "../common/Modal";
import ConfirmModal from "../common/ConfirmModal";
import steps from "../../data/steps";
import { periods, currentPeriod } from "../../data/periods";
import { useProcessStore } from "../../store/store";
import { updateProcess } from "../../services/processServicer";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Typography, SelectChangeEvent } from "@mui/material";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Grid,
} from "@mui/material";

const validationSchema = Yup.object({
  mode: Yup.string().required("* La modalidad es obligatoria"),
  period: Yup.date().required("* El periodo es obligatorio"),
});

interface RegistrationStageProps {
  onNext: () => void;
}

const getIdFromValue = (value: string) => {
  const period = periods.find((period) => period.value === value);
  return period ? period.id : "";
};

const getValueFromId = (id: number) => {
  const period = periods.find((period) => period.id === id);
  return period ? period.value : "";
};

export const RegistrationStage: FC<RegistrationStageProps> = ({ onNext }) => {
  const studentProcess = useProcessStore((state) => state.process);
  const setProcess = useProcessStore((state) => state.setProcess);
  const [modes, setModes] = useState<Modes[]>([]);
  const readOnly = true;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setError] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [edited, setEdited] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await getModes();
      setModes(response.data);
    } catch (error) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveStage = useCallback(
    async (mode: number, period: string) => {
      if (studentProcess) {
        studentProcess.modality_id = mode;
        studentProcess.period = period;
        setProcess({ ...studentProcess });
        await updateProcess(studentProcess);
        onNext();
      }
    },
    [studentProcess, setProcess, onNext]
  );

  const formik = useFormik({
    initialValues: {
      mode: Number(studentProcess?.modality_id),
      period: getIdFromValue(studentProcess?.period || currentPeriod),
    },
    validationSchema,
    onSubmit: () => {
      if (!edited) {
        onNext();
      } else {
        setShowModal(true);
      }
    },
  });

  const handleModalAction = useCallback(() => {
    saveStage(formik.values.mode, getValueFromId(Number(formik.values.period)));
    setIsVisible(false);
  }, [saveStage, formik.values.mode, formik.values.period]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleCloseMainModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEdited(true);
      formik.handleChange(event);
    },
    [formik]
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      setEdited(true);
      formik.handleChange(event);
    },
    [formik]
  );

  return (
    <>
      <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
        Etapa 1: Seminario de Grado
        <ModeEditIcon style={{ cursor: "not-allowed", opacity: 0.5 }} />
      </Typography>

      <form onSubmit={formik.handleSubmit} className="mt-5 mx-16">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={7} lg={8}>
            <FormControl component="fieldset">
              <FormLabel component="legend">1. Seleccione la Modalidad</FormLabel>
              <RadioGroup
                aria-label="mode"
                name="mode"
                row
                value={formik.values.mode}
                onChange={handleRadioChange}
              >
                {modes.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio disabled={readOnly} />}
                    label={option.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={8}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="period-label">2. Seleccione periodo de inscripción</InputLabel>
              <Select
                labelId="period-label"
                id="period"
                name="period"
                value={formik.values.period}
                onChange={handleSelectChange}
                label="2. Seleccione periodo de inscripción"
                disabled={readOnly}
                error={formik.touched.period && Boolean(formik.errors.period)}
              >
                {periods.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.period && formik.errors.period && (
                <div className="text-red-1 text-xs font-medium mt-1">{formik.errors.period}</div>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <div className="flex justify-end pt-5">
          <Button type="submit" variant="contained" color="primary">
            Siguiente
          </Button>
        </div>
      </form>
      {showModal && (
        <ConfirmModal
          step={steps[0]}
          nextStep={steps[1]}
          isApproveButton={true}
          setShowModal={handleCloseModal}
          onNext={handleModalAction}
        />
      )}
      <Modal isVisible={isVisible} setIsVisible={handleCloseMainModal} />
    </>
  );
};
