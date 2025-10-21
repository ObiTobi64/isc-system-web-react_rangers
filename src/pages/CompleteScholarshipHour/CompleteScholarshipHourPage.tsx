import { Grid, Tabs, Tab, Box } from "@mui/material";
import { useState, SyntheticEvent, useEffect } from "react";
import { Event } from "../../models/eventInterface";
import CompleteScholarshipHourEventCard from "../../components/cards/CompleteScholarshipHourEventCard";
import { getEventsService } from "../../services/eventsService";
import dayjs from "dayjs";

const CompleteScholarshipHourPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<Event[]>();

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchEvents = async () => {
    try {
      const res = await getEventsService();
      setEvents(res.data);
    } catch (error) {
      console.error(error, "Could not fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filterEvents = () => {
    const today = dayjs();
    const startOfMonth = today.startOf("month");
    const endOfMonth = today.endOf("month");
    return events?.filter((event) => {
      const eventStartDate = dayjs(event.start_date);
      const eventEndDate = dayjs(event.end_date);
      if (tabValue === 0) {
        return (
          (eventStartDate.isAfter(startOfMonth, "day") ||
            eventStartDate.isSame(startOfMonth, "day")) &&
          (eventStartDate.isBefore(endOfMonth, "day") ||
            eventStartDate.isSame(endOfMonth, "day")) &&
          eventEndDate.isAfter(today, "day")
        );
      } else if (tabValue === 1) {
        return eventStartDate.isAfter(today, "day") && eventEndDate.isAfter(today, "day");
      } else if (tabValue === 2) {
        return eventEndDate.isBefore(today, "day") || eventEndDate.isSame(today, "day");
      }

      return true;
    });
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "20px" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="event tabs">
          <Tab label="Eventos del mes" />
          <Tab label="Eventos próximos" />
          <Tab label="Eventos pasados" />
        </Tabs>
      </Box>

      <Grid container spacing={1} direction="column" alignItems="center" justifyContent="center">
        {filterEvents()?.map((event, index) => (
          <Grid item xs={12} key={index}>
            <CompleteScholarshipHourEventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CompleteScholarshipHourPage;
