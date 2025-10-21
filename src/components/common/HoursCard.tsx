import { Card, CardContent, Grid, Typography } from "@mui/material";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface HoursCardProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  count: number;
  subtitle: string;
  percentage: number;
}

function HoursCard({
  backgroundColor,
  textColor,
  title,
  subtitle,
  count,
  percentage,
}: HoursCardProps) {
  const roundedPercentage = Math.round(percentage);
  return (
    <Card
      sx = {{
        maxWidth: 345,
        background: backgroundColor,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Grid container justifyContent = "center" alignItems = "center">
          <Grid item xs = {6}>
            <Typography variant = "h5" component = "div" sx = {{ color: textColor, fontWeight: "bold" }}>
              {count} {"Horas\r"}
            </Typography>
            <Typography
              data-test-id = "message-total-hours-required"
              sx = {{
                fontSize: 14,
                color: textColor,
                mb: 1.5,
                fontWeight: "bold",
              }}
              color = "text.secondary"
            >
              {title}
            </Typography>
            <Typography sx = {{ fontSize: 12, color: textColor, mb: 1.5 }} color = "text.secondary">
              {subtitle}
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
                value = {roundedPercentage}
                text = {`${roundedPercentage}%`}
                background
                backgroundPadding = {6}
                styles = {buildStyles({
                  backgroundColor: "#FFFFFF",
                  textColor: "#000",
                  pathColor: backgroundColor,
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

export default HoursCard;
