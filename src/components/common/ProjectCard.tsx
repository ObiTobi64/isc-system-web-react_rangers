import { Card, CardContent, Grid, Typography } from "@mui/material";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ProjectCard() {
  const percentage = 75;

  return (
    <Card sx = {{ maxWidth: 345, background: "#FAAA1E", borderRadius: 3 }}>
      <CardContent>
        <Grid container justifyContent = "center" alignItems = "center">
          <Grid item xs = {6}>
            <Typography variant = "h5" component = "div" sx = {{ color: "#ffffff", fontWeight: "bold" }}>
              {"125\r"}
            </Typography>
            <Typography
              sx = {{
                fontSize: 14,
                color: "#ffffff",
                mb: 1.5,
                fontWeight: "bold",
              }}
              color = "text.secondary"
            >
              {"Procesos finalizados\r"}
            </Typography>
            <Typography sx = {{ fontSize: 12, color: "#ffffff", mb: 1.5 }} color = "text.secondary">
              {"2 en curso\r"}
            </Typography>
          </Grid>
          <Grid
            item
            xs = {6}
            style = {{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 100,
            }}
          >
            <div style = {{ width: "70%", height: 100 }}>
              <CircularProgressbar
                value = {percentage}
                text = {`${percentage}%`}
                background
                backgroundPadding = {6}
                styles = {buildStyles({
                  backgroundColor: "#FFFFFF",
                  textColor: "#000",
                  pathColor: "#FFD966",
                  trailColor: "#FFFFFF",
                })}
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
