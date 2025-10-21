import { Container } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FC, ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: FC<FormContainerProps> = ({ children }) => (
  <Container fixed>
    <Card sx = {{ maxWidth: 800 }}>
      <CardContent>{children}</CardContent>
    </Card>
  </Container>
);

export default FormContainer;