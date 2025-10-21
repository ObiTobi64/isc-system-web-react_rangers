import { FC, ReactNode } from "react";
import { Container, Stack, Box, Grid, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface ContainerPageProps {
  title: string;
  subtitle: string;
  actions: ReactNode;
  children: ReactNode;
}

const ContainerPage: FC<ContainerPageProps> = ({ title, subtitle, actions, children }) => (
  <Container fixed>
    <Stack
      direction = {{ xs: "column", sm: "row" }}
      justifyContent = "space-between"
      alignItems = {{ xs: "flex-start", sm: "center" }}
      spacing = {2}
      mb = {2}
    >
      <Box>
        <Typography
          variant = "h5"
          component = "div"
          color = "primary"
          sx = {{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <PersonIcon color = "primary" />
          {title}
        </Typography>
        <Typography variant = "subtitle2" color = "textSecondary" component = "div">
          {subtitle}
        </Typography>
      </Box>
      <Box>
        {actions}
      </Box>
    </Stack>
    <Grid container spacing = {3}>
      <Grid item xs = {12}>
        {children}
      </Grid>
    </Grid>
  </Container>
);

export default ContainerPage;
