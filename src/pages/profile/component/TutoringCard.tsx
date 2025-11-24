import { Grid } from "@mui/material";
import ProcessCard from "./ProcessCard";

const tutoringCardData = [
  { count: 5, percentage: 35.67, label: "Tutorias Finalizadas" },
  { count: 5, percentage: 35.67, label: "Tutorias En Progreso" },
  { count: 5, percentage: 35.67, label: "Revisiones Finalizadas" },
  { count: 5, percentage: 35.67, label: "Revisiones Progreso" },
];

const TutoringCard = () => (
  <Grid container spacing = {2}>
    {tutoringCardData.map((data, index) => (
      <Grid
        item xs = {12} sm = {6}
        md = {3} key = {index}>
        <ProcessCard count = {data.count} percentage = {data.percentage} label = {data.label} />
      </Grid>
    ))}
  </Grid>
);

export default TutoringCard;
