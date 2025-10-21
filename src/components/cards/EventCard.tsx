/* eslint-disable no-console */
/* eslint-disable camelcase */
import { useEffect, useState, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "../../style.css";
import { EventCardProps } from "../../models/eventCardProps";
import EventSubheader from "./EventSubheader";
import { getEventsInformations, registerInternEventService } from "../../services/eventsService";
import { useUserStore } from "../../store/store";
import { InternsInformation } from "../../models/internsInterface";
import { getInternByUserIdService, getInternData } from "../../services/internService";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const EventCard = ({ event }: EventCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [internInfomation, setInternInfomation] = useState<InternsInformation>();
  const [internEventInfomation, setInternEventInfomation] = useState<InternsInformation>();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [responsible, setResponsible] = useState<string>("Ninguno");
  const [isRegister, setisRegister] = useState(false);
  const [alert, setAlert] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const user = useUserStore((state) => state.user);

  const errorMessage = "Error fetching Intern:";

  const {
    id: id_event,
    title,
    description,
    start_date,
    end_date,
    duration_hours,
    location,
    is_finished,
    max_interns,
    min_interns,
    responsible_intern_id,
    registration_deadline,
  } = event;

  const fetchIntern = useCallback(async () => {
    try {
      const res = await getInternByUserIdService(user!.id);
      setInternInfomation(res.data);
    } catch (error) {
      console.error(errorMessage, error);
    }
  }, [user]);

  const fetchInternEvent = useCallback(async () => {
    try {
      if (responsible_intern_id) {
        const res = await getInternData(responsible_intern_id);
        setInternEventInfomation(res.data);
      }
    } catch (error) {
      console.error(errorMessage, error);
    }
  }, [responsible_intern_id]);

  const fetchInternEventInformation = useCallback(async () => {
    try {
      if (id_event && internInfomation) {
        const res = await getEventsInformations(id_event, internInfomation.id_intern);
        if (res.data) {
          setisRegister(true);
        } else {
          setisRegister(dayjs().isAfter(dayjs(registration_deadline)) || is_finished);
        }
      }
    } catch (error) {
      console.error(errorMessage, error);
    }
  }, [id_event, internInfomation, registration_deadline, is_finished]);

  useEffect(() => {
    fetchIntern();
  }, [fetchIntern]);

  useEffect(() => {
    if (internEventInfomation) {
      setResponsible(`${internEventInfomation.name} ${internEventInfomation.lastname}`);
    }
  }, [internEventInfomation]);

  useEffect(() => {
    fetchInternEvent();
  }, [fetchInternEvent]);

  useEffect(() => {
    fetchInternEventInformation();
  }, [fetchInternEventInformation]);

  dayjs.locale("es");

  const handleExpandClick = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    const res = await registerInternEventService(Number(id_event), Number(internInfomation?.id));
    if (res.success) {
      setisRegister(true);
      setAlert({
        severity: "success",
        message: `¡Te has registrado con éxito en el evento ${title}!`,
      });
    } else {
      setAlert({
        severity: "error",
        message: `No se pudo completar el registro para el evento ${title}. Por favor, intenta de nuevo más tarde.`,
      });
    }
    setSnackbarOpen(true);
    setDialogOpen(false);
  }, [id_event, internInfomation?.id, title]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const handleDescriptionClick = useCallback(() => {
    setShowFullDescription(!showFullDescription);
  }, [showFullDescription]);

  const handleDialogCloseWithReason = useCallback(
    (reason: string) => {
      if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
        handleDialogClose();
      }
    },
    [handleDialogClose]
  );

  return (
    <Card sx = {{ maxWidth: 345 }}>
      <CardHeader
        title = {title}
        titleTypographyProps = {{
          fontSize: 20,
          align: "center",
          color: "primary",
          fontWeight: "bold",
        }}
        sx = {{ minHeight: 100, maxHeight: 150 }}
      />
      <EventSubheader event = {event} />
      <CardContent sx = {{ flexGrow: 1 }}>
        <Typography
          fontSize = {16}
          color = "text.primary"
          onClick = {handleDescriptionClick}
          sx = {{
            cursor: "pointer",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: showFullDescription ? "unset" : 1,
            flex: 1,
            textAlign: "justify",
          }}
        >
          {description}
        </Typography>
        {!showFullDescription && description && description.length > 0 && (
          <Typography
            fontSize = {16}
            color = "primary"
            onClick = {handleDescriptionClick}
            sx = {{ cursor: "pointer" }}
          >
            {"[Ver más]\r"}
          </Typography>
        )}
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title = {isRegister ? "Registro cerrado" : "Registrarse"}>
          <span>
            <IconButton aria-label = "registrarse" onClick = {handleDialogOpen} disabled = {isRegister}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
        <ExpandMore
          expand = {expanded}
          onClick = {handleExpandClick}
          aria-expanded = {expanded}
          title = "Descripción"
          aria-label = "descripcion"
        >
          <DescriptionIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in = {expanded} timeout = "auto" unmountOnExit>
        <CardContent>
          <Typography align = "center" fontSize = {17} color = "primary">
            <strong>{"Detalles del evento"}</strong>
          </Typography>
          <Typography
            fontSize = {15} color = "text.primary" marginLeft = {2}
            marginTop = {2}>
            <strong>{"Fecha inicial: "}</strong> {dayjs(start_date).format("DD/MM/YYYY")}
          </Typography>
          <Typography fontSize = {15} color = "text.primary" marginLeft = {2}>
            <strong>{"Fecha final: "}</strong> {dayjs(end_date).format("DD/MM/YYYY")}
          </Typography>
          <Typography fontSize = {15} color = "text.primary" marginLeft = {2}>
            <strong>{"Supervisor: "}</strong> {responsible}
          </Typography>
          <Typography fontSize = {15} color = "text.primary" marginLeft = {2}>
            <strong>{"Duración: "}</strong> {duration_hours} {"horas\r"}
          </Typography>
          <Typography fontSize = {15} color = "text.primary" marginLeft = {2}>
            <strong>{"Ubicacion: "}</strong> {location}
          </Typography>
          <Typography fontSize = {15} color = "text.primary" marginLeft = {2}>
            <strong>{"Máx. Becarios: "}</strong> {max_interns}
          </Typography>
          <Typography fontSize = {15} color = "text.primary" marginLeft = {2}>
            <strong>{"Min. Becarios: "}</strong> {min_interns}
          </Typography>
        </CardContent>
      </Collapse>
      <Dialog
        open = {dialogOpen}
        onClose = {handleDialogCloseWithReason}
        aria-labelledby = "alert-dialog-title"
        aria-describedby = "alert-dialog-description"
        maxWidth = "sm"
      >
        <DialogTitle>
          <Typography variant = "h5" align = "center" sx = {{ fontWeight: "bold" }}>
            {"Confirmar inscripción\r"}
          </Typography>
          <IconButton
            aria-label = "close"
            onClick = {handleDialogClose}
            sx = {{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CancelIcon color = "primary" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant = "body1" align = "center">
            {'¿Estás seguro de inscribirte al evento "'}
            {title}
            {'"?\r'}
          </Typography>
        </DialogContent>
        <DialogActions sx = {{ justifyContent: "center", padding: "29px", marginTop: "-10px" }}>
          <Button
            onClick = {handleDialogClose}
            variant = "contained"
            sx = {{
              backgroundColor: "primary.main",
              color: "white",
              marginRight: 2,
              fontWeight: "bold",
              minWidth: "120px",
            }}
          >
            {"Cancelar\r"}
          </Button>
          <Button
            onClick = {handleConfirm}
            variant = "contained"
            sx = {{
              backgroundColor: "error.main",
              color: "white",
              fontWeight: "bold",
              minWidth: "120px",
            }}
          >
            {"Confirmar\r"}
          </Button>
        </DialogActions>
      </Dialog>

      {alert && (
        <Snackbar open = {snackbarOpen} autoHideDuration = {6000} onClose = {handleSnackbarClose}>
          <Alert onClose = {handleSnackbarClose} severity = {alert.severity} sx = {{ width: "100%" }}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </Card>
  );
};

export default EventCard;
