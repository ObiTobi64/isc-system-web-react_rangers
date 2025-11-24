import { Grid } from "@mui/material";
import ProcessCard from "./ProcessCard";

const processCardsData = [
  { count: 5, label: "Horas becarias totales" },
  { count: 5, label: "Horas becarias trabajadas" },
  { count: 5, label: "Horas becarias restantes" },
  { count: 5, label: "Certificaciones" },
];

const StudentCard = () => (
  <Grid container spacing = {2}>
    {processCardsData.map((data, index) => (
      <Grid
        item xs = {12} sm = {6}
        md = {3} key = {index}>
        <ProcessCard count = {data.count} label = {data.label} />
      </Grid>
    ))}
  </Grid>
);

export default StudentCard;
