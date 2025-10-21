/* eslint-disable no-console */
/* eslint-disable camelcase */
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { FC, ReactNode, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../../models/eventInterface";
import { finishEventService, getFullEventInformationService } from "../../services/eventsService";
import ConfirmDialog from "../common/ConfirmDialog";

interface CSHCardProps {
  event: Event;
  children?: ReactNode;
}

const CompleteScholarshipHourEventCard: FC<CSHCardProps> = ({ event }) => {
  const {
    id,
    title,
    description,
    assigned_hours,
    start_date,
    duration_hours,
    location,
    max_interns,
    min_interns,
  } = event;
  const navigate = useNavigate();
  dayjs.locale("es");

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const fetchFullEvent = useCallback(async () => {
    if (!id) {
      console.error("Could not event with such id");
      return;
    }
    try {
      await getFullEventInformationService(id.toString());
    } catch (error) {
      console.error("Could not fetch event", error);
    }
  }, [id]);

  useEffect(() => {
    fetchFullEvent();
  }, [fetchFullEvent]);

  const goToEditHours = useCallback(() => {
    navigate(`/eventRegisters/${id}`);
  }, [navigate, id]);

  const handleConfirmDialogOpen = useCallback(() => {
    setConfirmDialogOpen(true);
  }, []);

  const handleConfirmDialogClose = useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const handleConfirmDialogFinish = useCallback(async () => {
    try {
      if (!id) {
        console.error("Id is undefined");
        return;
      }
      await finishEventService(id);
    } catch (error) {
      console.error("Error while finishing event");
    }
    setConfirmDialogOpen(false);
  }, [id]);

  const handleEditHours = useCallback(() => {
    setConfirmDialogOpen(false);
    goToEditHours();
  }, [goToEditHours]);

  return (
    <Card sx = {{ maxWidth: 1150 }}>
      <CardContent>
        <Grid container spacing = {3}>
          <Grid item xs = {12}>
            <Typography fontSize = {20} color = "text.primary" sx = {{ fontWeight: "bold" }}>
              {title}
            </Typography>
          </Grid>
          <Grid item xs = {12} md = {3.5}>
            <Typography fontSize = {17} color = "text.primary">
              <strong>{"Fecha:"}</strong> {dayjs(start_date).format("DD/MM/YYYY")}
            </Typography>
            <Typography fontSize = {17} color = "text.primary">
              <strong>{"Duración:"}</strong> {duration_hours}
            </Typography>
            <Typography fontSize = {17} color = "text.primary">
              <strong>{"Horas becarias:"}</strong> {assigned_hours}
            </Typography>
            <Typography fontSize = {17} color = "text.primary">
              <strong>{"Lugar:"}</strong> {location}
            </Typography>
            <Typography fontSize = {17} color = "text.primary">
              <strong>{"Máximo de becarios:"}</strong> {max_interns}
            </Typography>
            <Typography fontSize = {17} color = "text.primary">
              <strong>{"Máximo de suplentes:"}</strong> {min_interns}
            </Typography>
          </Grid>
          <Grid item xs = {12} md = {5}>
            <Typography fontSize = {17} color = "text.primary">
              <strong>{"Descripción:"}</strong> {description}
            </Typography>
          </Grid>
          <Grid
            item
            xs = {12}
            md = {3.5}
            sx = {{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              aria-label = "Solicitudes de inscripción"
              variant = "contained"
              color = "secondary"
              sx = {{ width: 250 }}
              onClick = {goToEditHours}
            >
              {"Solicitudes de inscripción\r"}
            </Button>
            <Button
              aria-label = "Finalizar evento"
              variant = "contained"
              color = "error"
              sx = {{ marginTop: 3, width: 180 }}
              onClick = {handleConfirmDialogOpen}
            >
              {"Finalizar evento\r"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <ConfirmDialog
        open = {confirmDialogOpen}
        onClose = {handleConfirmDialogClose}
        onConfirm = {handleConfirmDialogFinish}
        title = "Finalizar evento"
        description = "¿Estás seguro de que deseas finalizar este evento? Esta acción no se puede deshacer"
        secondaryButtonText = "Editar horas"
        onSecondaryButtonClick = {handleEditHours}
      />
    </Card>
  );
};

export default CompleteScholarshipHourEventCard;