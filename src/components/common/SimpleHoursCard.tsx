import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

interface SimpleHoursCardProps {
  backgroundColor: string;
  textColor: string;
  title: string;
  count: number;
  subtitle: string;
}
function SimpleHoursCard({
  backgroundColor,
  textColor,
  title,
  count,
  subtitle,
}: SimpleHoursCardProps) {
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
          <Grid item xs = {12}>
            <Typography variant = "h5" component = "div" sx = {{ color: textColor, fontWeight: "bold" }}>
              {count} {"Horas\r"}
            </Typography>

            <Box sx = {{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx = {{
                  fontSize: 16,
                  color: textColor,
                  fontWeight: "bold",
                }}
              >
                {title}
              </Typography>
              <Typography
                sx = {{
                  fontSize: 18,
                  color: textColor,
                  fontWeight: "bold",
                  marginTop: "-16px",
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SimpleHoursCard;
