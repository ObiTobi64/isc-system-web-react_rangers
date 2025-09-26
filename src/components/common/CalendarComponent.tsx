import { Card, CardContent, Typography } from "@mui/material";
// @ts-ignore
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

const calendarStyles = `
  .rbc-toolbar {
    flex-wrap: nowrap !important;
  }
  .rbc-toolbar .rbc-btn-group {
    flex-wrap: nowrap !important;
  }
`;

moment.locale("es");
const localizer = momentLocalizer(moment);

moment.updateLocale("es", {
  week: {
    dow: 1,
  },
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
});

const messages = {
  today: "Hoy",
  previous: "Atrás",
  next: "Siguiente",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango.",
  showMore: (total: number) => `+ Ver más (${total})`,
};

// Componente CalendarCard
// @ts-ignore
const CalendarCard = ({ events }) => {
  return (
    <Card raised sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography
          data-test-id="calendar-title"
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          Calendario de Eventos
        </Typography>
        <style>{calendarStyles}</style>
        <div style={{ height: 400 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            messages={messages}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
