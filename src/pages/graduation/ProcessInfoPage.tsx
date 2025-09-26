import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { Grid } from "@mui/material";
import Checklist from "../../components/Checklist";
import ProgressTracker from "../../components/ProgressTracker";
import { Seminar } from "../../models/studentProcess";
import { useProcessStore } from "../../store/store";
import { steps } from "../../data/steps";

const ProcessInfoPage = () => {
  const updateProcess = useProcessStore((state) => state.setProcess);
  const process = useLoaderData() as { data: Seminar };
  const { data } = process;
  updateProcess(data);

  useEffect(() => {
    updateProcess(data);
  }, [data, updateProcess]);

  const stageProcess = data.stage_id || 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={false} sm={12} md={7} lg={8}>
        <ProgressTracker
          currentStepIndex={stageProcess}
          status={steps[stageProcess]}
          studentProcess={data}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5} lg={4}>
        <Checklist />
      </Grid>
    </Grid>
  );
};

export default ProcessInfoPage;
