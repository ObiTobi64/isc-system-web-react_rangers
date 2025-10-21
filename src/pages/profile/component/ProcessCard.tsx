import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { FC } from "react";

interface ProcessCardProps {
  count: number;
  percentage?: number;
  label: string;
}

const ProcessCard: FC<ProcessCardProps> = ({ count, percentage, label }) => (
  <Card
    sx = {{
      display: "flex",
      alignItems: "center",
      padding: 2,
      borderRadius: 2,
      backgroundColor: "#fff",
    }}
  >
    <CardContent
      sx = {{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box sx = {{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant = "h4" sx = {{ fontWeight: "bold", mr: 1 }}>
          {count}
        </Typography>
        <IconButton size = "small">
          <InfoIcon fontSize = "small" />
        </IconButton>
      </Box>
      <Typography variant = "body2" color = "textSecondary">
        {label}
      </Typography>
      {percentage !== undefined && (
        <Box sx = {{ display: "flex", alignItems: "center", mt: 1 }}>
          <ArrowUpwardIcon fontSize = "small" sx = {{ color: "green", mr: 0.5 }} />
          <Typography variant = "body2" sx = {{ color: "green" }}>
            {percentage}
            {"%\r"}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default ProcessCard;
