import { Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import NumberCard from "../../components/common/NumberCard";
import AreaChartCard from "../../components/common/AreaChart";
import CalendarCard from "../../components/common/CalendarComponent";
import { getStats } from "../../services/statsService";

const data = [
  { period: "2021 Q1", approved: 200 },
  { period: "2021 Q2", approved: 450 },
  { period: "2021 Q3", approved: 300 },
  { period: "2021 Q4", approved: 500 },
  { period: "2022 Q1", approved: 600 },
  { period: "2022 Q2", approved: 700 },
];

const myEventsList = [
  {
    title: "Conferencia sobre Graduación",
    start: new Date(2023, 9, 20, 10, 0, 0),
    end: new Date(2023, 9, 20, 15, 0, 0),
  },
  {
    title: "Revisión de Tesis",
    start: new Date(2023, 9, 22, 9, 30, 0),
    end: new Date(2023, 9, 22, 12, 0, 0),
  },
];

interface Stats {
  num_tutorias_progreso: number;
  num_tutorias_aprobadas: number;
  num_reviewers_progreso: number;
  num_reviewers_aprobados: number;
  total_procesos: number;
  num_procesos_finalizados: number;
}

export const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>();
  
  useEffect(() => {
    getStats().then((result) => {
      setStats(result.data);
    });
  }, []);

  return (
    <Container 
      fixed 
      sx = {{ 
        minWidth: 1200,
        maxWidth: 1400,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        }
      }}
    >
      <Grid container spacing = {3} sx = {{ minWidth: 1200 }}>
        <Grid item xs = {12}>
          <Grid container spacing = {3} sx = {{ minWidth: 1200 }}>
            <Grid item xs = {4} sx = {{ minWidth: 400 }}>
              <Grid container spacing = {3} marginTop = "15px">
                <Grid item xs = {12}>
                  <NumberCard
                    backgroundColor = "#FAAA1E"
                    textColor = "#ffffff"
                    title = "Procesos Finalizados"
                    subtitle = {`${
                      (stats?.total_procesos || 0) - (stats?.num_procesos_finalizados || 0)
                    } en curso`}
                    count = {stats?.num_procesos_finalizados || 0}
                    percentage = {
                      ((stats?.num_procesos_finalizados || 0) * 100) / (stats?.total_procesos || 1)
                    }
                  />
                </Grid>
                <Grid item xs = {12}>
                  <NumberCard
                    backgroundColor = "#1450A3"
                    textColor = "#FFFFFF"
                    title = "Tutorias finalizadas"
                    subtitle = {`${stats?.num_tutorias_progreso || 0} en curso`}
                    count = {stats?.num_tutorias_aprobadas || 0}
                    percentage = {
                      ((stats?.num_tutorias_aprobadas || 0) * 100) / (stats?.total_procesos || 1)
                    }
                  />
                </Grid>
                <Grid item xs = {12}>
                  <NumberCard
                    backgroundColor = "#337CCF"
                    textColor = "#FFFFFF"
                    title = "Revisiones finalizadas"
                    subtitle = {`${stats?.num_reviewers_progreso || 0} en curso`}
                    count = {stats?.num_reviewers_aprobados || 0}
                    percentage = {
                      ((stats?.num_reviewers_aprobados || 0) * 100) / (stats?.total_procesos || 1)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs = {8} sx = {{ minWidth: 800 }}>
              <CalendarCard events = {myEventsList} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs = {12} sx = {{ minWidth: 1200 }}>
          <AreaChartCard title = "Estudiantes Aprobados por Período" data = {data} />
        </Grid>
      </Grid>
    </Container>
  );
};