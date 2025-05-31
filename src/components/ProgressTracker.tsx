import { FC, useState, useCallback } from "react";
import { Stepper, Step, StepLabel, Box, Typography, Snackbar, Alert } from "@mui/material";
import InternalDefenseStage from "./stages/InternalDefenseStage";
import { MentorStage } from "./stages/MentorStage";
import { RegistrationStage } from "./stages/RegistrationStage";
import { ReviewerStage } from "./stages/ReviewerStage";
import ExternalDefenseStage from "./stages/ExternalDefenseStage";
import { Seminar } from "../models/studentProcess";
import { steps } from "../data/steps";
import { useProcessStore } from "../store/store";

interface ProgressTrackerProps {
  currentStepIndex: number;
  status: string;
  studentProcess: Seminar;
}

const ProgressTracker: FC<ProgressTrackerProps> = ({ currentStepIndex }) => {
  const process = useProcessStore((state) => state.process);
  const [currentStage, setCurrentStage] = useState(currentStepIndex);
  const { stage_id: stageId } = process || { stage_id: 0 };
  const [alertOpen, setAlertOpen] = useState(false);

  const goToNextStage = useCallback(() => {
    setCurrentStage((prevStage) => prevStage + 1);
  }, []);

  const goToPreviousStage = useCallback(() => {
    setCurrentStage((prevStage) => prevStage - 1);
  }, []);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleStep = (step: number) => () => {
    if (step > stageId) {
      setAlertOpen(true);
    } else {
      setCurrentStage(step);
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 0:
        return <RegistrationStage onNext={goToNextStage} />;
      case 1:
        return <MentorStage onNext={goToNextStage} onPrevious={goToPreviousStage} />;
      case 2:
        return <ReviewerStage onNext={goToNextStage} onPrevious={goToPreviousStage} />;
      case 3:
        return <InternalDefenseStage onPrevious={goToPreviousStage} onNext={goToNextStage} />;
      case 4:
        return <ExternalDefenseStage onPrevious={goToPreviousStage} />;
      default:
        return null;
    }
  };

  return (
    <Box className="bg-white m-5 p-5 shadow-md rounded-lg h-full">
      <Box className="flex items-center justify-between my-2 mx-5">
        <Typography variant="h4" className="font-semibold">
          {"Progreso"}
        </Typography>
        <Box className="flex items-center space-x-4 mx-5">
          <Typography variant="h6" className="font-semibold text-primary">
            {"Estado: "}
            <span className="text-red-1 font-medium">{steps[process?.stage_id ?? 0]}</span>
          </Typography>
        </Box>
      </Box>
      <Stepper activeStep={process?.stage_id} alternativeLabel>
        {steps.map((label, index) => (
          <Step
            key={index}
            completed={index <= (process?.stage_id || 1)}
            onClick={handleStep(index)}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box className="m-5 p-5 w-full">{renderStage()}</Box>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleAlertClose} severity="warning" sx={{ width: "100%" }}>
          {"Debe completar la etapa actual para continuar."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProgressTracker;
