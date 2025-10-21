import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const LoadingOverlay = ({ message }: { message: string }) => (
  <Backdrop sx = {{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open = {true}>
    <Box textAlign = "center">
      <CircularProgress color = "inherit" />
      <Typography variant = "h6" sx = {{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  </Backdrop>
);

export default LoadingOverlay;
