/* eslint-disable no-console */
import { Grid, Box, Container } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import GraphicHours from "./GraphicHours";
import HoursCard from "../../components/common/HoursCard";
import { Interns } from "../../models/internsInterface";
import { getInternByUserIdService } from "../../services/internService";
import { useUserStore } from "../../store/store";
import SimpleHoursCard from "../../components/common/SimpleHoursCard";
import { getCurrentSemester } from "../../utils/general";

function HoursPage() {
  const [intern, setIntern] = useState<Interns>();
  const currentSemester = getCurrentSemester();
  const user = useUserStore((state) => state.user);

  const fetchIntern = useCallback(async () => {
    try {
      const res = await getInternByUserIdService(user!.id);
      if (res.success) {
        setIntern(res.data);
      }
    } catch (error) {
      console.error("Error fetching intern data:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchIntern();
  }, [fetchIntern]);

  return (
    <Container fixed>
      <Grid
        container spacing = {8} alignItems = "center"
        justifyContent = "center">
        <Grid item xs = {22} md = {4}>
          <Grid container spacing = {3}>
            <Grid item xs = {12}>
              <SimpleHoursCard
                backgroundColor = "#f3a43f"
                textColor = "#FFFFFF"
                title = "Total de Horas Requeridas"
                subtitle = {currentSemester}
                count = {intern?.total_hours || 0}
              />
            </Grid>
            <Grid item xs = {12}>
              <HoursCard
                backgroundColor = "#359be5"
                textColor = "#FFFFFF"
                title = "Horas Realizadas"
                subtitle = ""
                count = {intern?.completed_hours || 0}
                percentage = {((intern?.completed_hours || 0) / (intern?.total_hours || 1)) * 100}
              />
            </Grid>
            <Grid item xs = {12}>
              <HoursCard
                backgroundColor = "#ef4444"
                textColor = "#FFFFFF"
                title = "Horas Faltantes"
                subtitle = ""
                count = {intern?.pending_hours || 0}
                percentage = {((intern?.pending_hours || 0) / (intern?.total_hours || 1)) * 100}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs = {16} md = {6}>
          <Box sx = {{ width: "100%", padding: "20px" }}>
            <GraphicHours />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HoursPage;