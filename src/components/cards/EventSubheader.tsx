import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { EventCardProps } from "../../models/eventCardProps";
import { FC } from "react";

const EventSubheader: FC<EventCardProps> = ({ event }) => {
  dayjs.locale("es");

  return (
    <>
      <Typography fontSize={15} color="text.primary" marginLeft={3}>
        <strong>Fecha límite de inscripción: </strong>
        {dayjs(event.registration_deadline).format("DD/MM/YYYY")}
      </Typography>
      <Typography fontSize={15} color="text.primary" marginLeft={3}>
        <strong>Periodo de baja: </strong>
        {dayjs(event.start_cancellation_date).format("DD/MM/YYYY")} -{" "}
        {dayjs(event.end_cancellation_date).format("DD/MM/YYYY")}
      </Typography>
      <Typography fontSize={15} color="text.primary" marginLeft={3}>
        <strong>Horas becarias: </strong>
        {event.assigned_hours} horas
      </Typography>
    </>
  );
};

export default EventSubheader;
