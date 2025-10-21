/* eslint-disable no-console */
import { FC, ReactNode, useEffect, useState, useCallback } from "react";
import { Container, Grid, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import dayjs from "dayjs";
import { FullEvent } from "../../models/eventInterface";
import internRegisterStates from "../../constants/internRegisterStates";
import { InternsInformation } from "../../models/internsInterface";
import { getInternData } from "../../services/internService";

interface TablePageProps {
  event: FullEvent;
  children: ReactNode;
}

const TablePage: FC<TablePageProps> = ({ event, children }) => {
  const [internEventInfomation, setInternEventInfomation] = useState<InternsInformation>();
  const [responsible, setResponsible] = useState<string>("Ninguno");

  const fetchInternEvent = useCallback(async () => {
    try {
      if (event.responsible_intern_id) {
        const res = await getInternData(event.responsible_intern_id);
        setInternEventInfomation(res.data);
      }
    } catch (error) {
      console.error("Error fetching Intern:", error);
    }
  }, [event.responsible_intern_id]);

  useEffect(() => {
    if (internEventInfomation) {
      setResponsible(`${internEventInfomation.name} ${internEventInfomation.lastname}`);
    }
  }, [internEventInfomation]);

  useEffect(() => {
    fetchInternEvent();
  }, [fetchInternEvent]);

  const { PENDING } = internRegisterStates;
  const dateFormat = "DD/MM/YYYY";

  return event ? (
    <Container fixed>
      <Grid container spacing = {3}>
        <Grid item xs = {12}>
          <Typography
            variant = "h4"
            component = "h1"
            color = "primary"
            sx = {{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PersonIcon color = "primary" />
            {event.title}
          </Typography>
          <Grid container spacing = {-30} sx = {{ marginTop: 2 }}>
            <Grid item xs = {6}>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Fecha Inicial:"}</strong> {dayjs(event.start_date).format(dateFormat)}
              </Typography>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Fecha Final:"}</strong> {dayjs(event.end_date).format(dateFormat)}
              </Typography>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Encargado:"}</strong> {responsible}
              </Typography>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Ubicación:"}</strong> {event.location}
              </Typography>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Máx.Becarios:"}</strong> {event.max_interns}
              </Typography>
            </Grid>
            <Grid item xs = {6}>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Periodo de Inscripción/Baja:"}</strong>{" "}
                {dayjs(event.start_cancellation_date).format(dateFormat)}
                {" -"} {dayjs(event.end_cancellation_date).format(dateFormat)}
              </Typography>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Horas Becarias:"}</strong> {event.assigned_hours} {"horas\r"}
              </Typography>
              <Typography variant = "body1" color = "textSecondary">
                <strong>{"Duración:"}</strong> {event.duration_hours} {"horas\r"}
              </Typography>
              <Typography variant = "body1" color = "textSecondary">
                <strong>
                  {"Solicitudes de Becarios:"}{" "}
                  {event.interns.reduce((acc: number, intern) => {
                    if (intern.type === PENDING) {
                      return acc + 1;
                    }
                    return acc;
                  }, 0)}
                </strong>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs = {12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Typography variant = "h6" align = "center">
      {"Cargando detalles del evento...\r"}
    </Typography>
  );
};

export default TablePage;
