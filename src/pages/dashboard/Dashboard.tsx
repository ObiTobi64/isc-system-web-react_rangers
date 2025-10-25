/* eslint-disable no-console */
import { Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import NumberCard from "../../components/common/NumberCard";
import AreaChartCard from "../../components/common/AreaChart";
import CalendarCard from "../../components/common/CalendarComponent";
import getStats from "../../services/statsService";

const DASHBOARD_MIN_WIDTH = 1200;

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchStats = useCallback(async () => {
    try {
      const result = await getStats();
      setStats(result.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <Container
      fixed
      sx={{
        ...(isMobile && {
          minWidth: "100%",
          overflowX: "auto",
          scrollbarColor: "#c1c1c1 #f1f1f1",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: 4,
            transition: "background 0.3s ease",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8",
          },
          "&::-webkit-scrollbar-corner": {
            background: "#f1f1f1",
          },
        }),
        ...(!isMobile && {
          maxWidth: 1400,
          overflowX: "hidden",
        }),
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          ...(isMobile && { minWidth: DASHBOARD_MIN_WIDTH }),
        }}
      >
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            sx={{
              ...(isMobile && { minWidth: DASHBOARD_MIN_WIDTH }),
            }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                ...(isMobile && { minWidth: 400 }),
              }}
            >
              <Grid container spacing={3} marginTop="15px">
                <Grid item xs={12}>
                  <NumberCard
                    backgroundColor="#FAAA1E"
                    textColor="#ffffff"
                    title="Procesos Finalizados"
                    subtitle={`${
                      (stats?.total_procesos || 0) - (stats?.num_procesos_finalizados || 0)
                    } en curso`}
                    count={stats?.num_procesos_finalizados || 0}
                    percentage={
                      ((stats?.num_procesos_finalizados || 0) * 100) / (stats?.total_procesos || 1)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <NumberCard
                    backgroundColor="#1450A3"
                    textColor="#FFFFFF"
                    title="Tutorias finalizadas"
                    subtitle={`${stats?.num_tutorias_progreso || 0} en curso`}
                    count={stats?.num_tutorias_aprobadas || 0}
                    percentage={
                      ((stats?.num_tutorias_aprobadas || 0) * 100) / (stats?.total_procesos || 1)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <NumberCard
                    backgroundColor="#337CCF"
                    textColor="#FFFFFF"
                    title="Revisiones finalizadas"
                    subtitle={`${stats?.num_reviewers_progreso || 0} en curso`}
                    count={stats?.num_reviewers_aprobados || 0}
                    percentage={
                      ((stats?.num_reviewers_aprobados || 0) * 100) / (stats?.total_procesos || 1)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                ...(isMobile && { minWidth: 800 }),
              }}
            >
              <CalendarCard events={myEventsList} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ...(isMobile && { minWidth: DASHBOARD_MIN_WIDTH }),
          }}
        >
          <AreaChartCard title="Estudiantes Aprobados por Período" data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
