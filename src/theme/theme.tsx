import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#191D88",
    },
    secondary: {
      main: "#1450A3",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#333",
          color: "#fff",
          fontSize: "0.7rem",
          fontWeight: 400,
          borderRadius: "4px",
          padding: "1px 2px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        },
        arrow: {
          color: "#333",
        },
      },
    },
  },
});

export default theme;
