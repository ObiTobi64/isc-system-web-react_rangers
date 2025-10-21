import { FC, useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Typography,
  Alert,
  AlertTitle,
  SelectChangeEvent,
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
import Modes from "../../models/modeInterface";
import getModes from "../../services/modesService";
import { Modal } from "../common/Modal";
import ConfirmModal from "../common/ConfirmModal";
import steps from "../../data/steps";
import { periods, currentPeriod } from "../../data/periods";
import { useProcessStore } from "../../store/store";
import { updateProcess } from "../../services/processServicer";

const LOCKED_MESSAGE = 'No se puede modificar un seminario aprobado';

const validationSchema = Yup.object({
  mode: Yup.string()
    .required("* La modalidad es obligatoria")
    .test('is-locked', LOCKED_MESSAGE, 
      function isNotLocked() {
        return !this.options?.context?.isReadOnly;
      }
    ),
  period: Yup.date()
    .required("* El periodo es obligatorio")
    .test('is-locked', LOCKED_MESSAGE, 
      function isNotLocked() {
        return !this.options?.context?.isReadOnly;
      }
    ),
});

interface RegistrationStageProps {
  onNext: () => void;
}

const getIdFromValue = (value: string) => {
  const foundPeriod = periods.find((p) => p.value === value);
  return foundPeriod ? foundPeriod.id : "";
};

const getValueFromId = (id: number) => {
  const foundPeriod = periods.find((p) => p.id === id);
  return foundPeriod ? foundPeriod.value : "";
};

// eslint-disable-next-line import/prefer-default-export
export const RegistrationStage: FC<RegistrationStageProps> = ({ onNext }) => {
  const studentProcess = useProcessStore((state) => state.process);
  const setProcess = useProcessStore((state) => state.setProcess);
  const [modes, setModes] = useState<Modes[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [, setError] = useState<Error | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [edited, setEdited] = useState(false);
  const [readOnly, setReadOnly] = useState<boolean>(true);

  const checkSeminarApproved = useCallback(() => {
    if (!studentProcess) {
      return true;
    }

    const isApproved = Boolean(
      studentProcess.seminar_enrollment === "true" &&
      studentProcess.date_seminar_enrollment &&
      studentProcess.stage_id > 0
    );

    // También bloquear si estamos en una etapa posterior
    const isLaterStage = studentProcess.stage_id > 0;

    return isApproved || isLaterStage;
  }, [studentProcess]);

  // Actualizar el estado de solo lectura cuando cambie el proceso
  useEffect(() => {
    setReadOnly(checkSeminarApproved());
  }, [checkSeminarApproved]);

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
      if (!studentProcess) {
        return;
      }

      // Volver a verificar el estado de aprobación antes de guardar
      if (checkSeminarApproved()) {
        return;
      }

      try {
        // Primero crear una copia del proceso para no mutar el estado directamente
        const updatedProcess = { ...studentProcess };
        updatedProcess.modality_id = mode;
        updatedProcess.period = period;
        
        // Intentar actualizar en el backend primero
        await updateProcess(updatedProcess);
        
        // Si la actualización fue exitosa, actualizar el estado local
        setProcess(updatedProcess);
        onNext();
      } catch (error) {
        // Error al guardar los cambios
        setError('No se pudieron guardar los cambios. Por favor, intente de nuevo.');
      }
    },
    [studentProcess, setProcess, onNext, checkSeminarApproved]
  );

  const formik = useFormik({
    initialValues: {
      mode: Number(studentProcess?.modality_id),
      period: getIdFromValue(studentProcess?.period || currentPeriod),
    },
    validationSchema: validationSchema.concat(
      Yup.object().shape({
        mode: Yup.string().test(
          'is-editable',
          'No se puede modificar un seminario aprobado',
          () => !readOnly
        ),
        period: Yup.string().test(
          'is-editable',
          'No se puede modificar un seminario aprobado',
          () => !readOnly
        ),
      })
    ),
    onSubmit: () => {
      // No permitir envío del formulario si está en modo solo lectura
      if (readOnly) {
        return;
      }

      if (!edited) {
        onNext();
      } else {
        setShowModal(true);
      }
    },
    enableReinitialize: true,
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
    (event: { target: { name: string; value: unknown } }) => {
      if (readOnly) {
        return;
      }
      setEdited(true);
      formik.handleChange(event);
    },
    [formik, readOnly]
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string | number>) => {
      if (readOnly) {
        return;
      }
      setEdited(true);
      formik.handleChange(event);
    },
    [formik, readOnly]
  );

  return (
    <>
      <Typography variant = "h6" gutterBottom sx = {{ fontWeight: 'bold' }}>
        {"Etapa 1: Seminario de Grado"}
        {' '}
        {!readOnly && <ModeEditIcon sx = {{ cursor: "pointer" }} />}
        {readOnly && <ModeEditIcon sx = {{ cursor: "not-allowed", opacity: 0.5 }} />}
      </Typography>

      {readOnly && (
        <Alert severity = "warning" sx = {{ mb: 2 }} icon = {<WarningIcon />}>
          <AlertTitle>{"Fase de Seminario de Grado Registrada"}</AlertTitle>
          {"Esta fase ya ha sido aprobada y registrada. No se pueden modificar los datos del seminario"}
          {"una vez que han sido aprobados. Si necesita realizar cambios excepcionales, por favor"}
          {"contacte al administrador del sistema."}
        </Alert>
      )}
  
      <form onSubmit = {formik.handleSubmit} className = "mt-5 mx-16">
        <Grid container spacing = {3}>
          <Grid
            item xs = {12} sm = {12}
            md = {7} lg = {8}>
            <FormControl component = "fieldset">
              <FormLabel component = "legend">{"1. Seleccione la Modalidad"}</FormLabel>
              <RadioGroup
                aria-label = "mode"
                name = "mode"
                row
                value = {formik.values.mode}
                onChange = {handleRadioChange}
              >
                {modes.map((option) => (
                  <FormControlLabel
                    key = {option.id}
                    value = {option.id}
                    control = {<Radio disabled = {readOnly} />}
                    label = {option.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid
            item xs = {12} sm = {12}
            md = {7} lg = {8}>
            <FormControl fullWidth variant = "outlined" margin = "normal">
              <InputLabel id = "period-label">{"2. Seleccione periodo de inscripción"}</InputLabel>
              <Select
                labelId = "period-label"
                id = "period"
                name = "period"
                value = {formik.values.period}
                onChange = {handleSelectChange}
                label = "2. Seleccione periodo de inscripción"
                disabled = {readOnly}
                error = {formik.touched.period && Boolean(formik.errors.period)}
              >
                {periods.map((option) => (
                  <MenuItem key = {option.id} value = {option.id}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.period && formik.errors.period && (
                <div className = "text-red-1 text-xs font-medium mt-1">{formik.errors.period}</div>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <div className = "flex justify-end pt-5">
          <Button 
            type = "submit" 
            variant = "contained" 
            color = "primary"
            disabled = {readOnly && edited} 
          >
            {"Siguiente"}
          </Button>
        </div>
      </form>
      {showModal && (
        <ConfirmModal
          step = {steps[0]}
          nextStep = {steps[1]}
          isApproveButton = {true}
          setShowModal = {handleCloseModal}
          onNext = {handleModalAction}
        />
      )}
      <Modal isVisible = {isVisible} setIsVisible = {handleCloseMainModal} />
    </>
  );
};
