import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import { getInternByUserIdService, getInternEvents } from "../../services/internService";
import { EventInternsType } from "../../models/eventInterface";
import { useUserStore } from "../../store/store";
import { InternsInformation } from "../../models/internsInterface";

dayjs.locale("es");

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const statusTranslation = (status: string) => {
  const statusMap: Record<string, string> = {
    accepted: "Aceptado",
    rejected: "Rechazado",
    reserve: "Suplente",
    pending: "Pendiente",
  };
  return statusMap[status.toLowerCase()] || status;
};

const groupEventsByMonth = (events: EventInternsType[]): Record<string, EventInternsType[]> => {
  return events?.reduce((acc: Record<string, EventInternsType[]>, event: EventInternsType) => {
    const month = capitalizeFirstLetter(dayjs(event.start_date).format("MMMM YYYY"));
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {});
};

const SplitButton = ({ options }: { options: { label: string; onClick: () => void }[] }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleClick = () => {
    options[selectedIndex].onClick();
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
    options[index].onClick();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        style={{ marginLeft: "3%", marginTop: "19px" }}
      >
        <Button onClick={handleClick}>{options[selectedIndex].label}</Button>
        <Button size="small" onClick={handleToggle}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
            <Paper
              style={{
                backgroundColor: "#fff",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                zIndex: 1500,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.label}
                      selected={index === selectedIndex}
                      onClick={() => handleMenuItemClick(index)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

const EventHistory = () => {
  const [historyEvents, setHistoryEvents] = useState<EventInternsType[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [internInfomation, setInternInfomation] = useState<InternsInformation>();
  const user = useUserStore((state) => state.user);
  const fetchEvents = async () => {
    if (internInfomation) {
      const res = await getInternEvents(internInfomation.id_intern);
      if (res.success) {
        setHistoryEvents(res.data);
      }
    }
  };
  const fetchIntern = async () => {
    try {
      const res = await getInternByUserIdService(user!.id);
      setInternInfomation(res.data);
    } catch (error) {
      console.error("Error fetching Intern:", error);
    }
  };
  useEffect(() => {
    fetchIntern();
  }, []);
  useEffect(() => {
    fetchEvents();
  }, [internInfomation]);

  useEffect(() => {
    if (selectedSemester !== null) {
      fetchEvents();
    }
  }, [selectedSemester]);

  const filteredEvents = (semester: number) =>
    historyEvents?.filter((event) =>
      semester === 0
        ? dayjs(event.start_date).isBefore(dayjs("2024-07-01"))
        : dayjs(event.start_date).isAfter(dayjs("2024-06-30"))
    );

  const groupedEvents = (semester: number) => groupEventsByMonth(filteredEvents(semester)!);

  return (
    <div style={{ position: "relative" }}>
      <SplitButton
        options={[
          { label: "Semestre I - 2024", onClick: () => setSelectedSemester(0) },
          { label: "Semestre II - 2024", onClick: () => setSelectedSemester(1) },
        ]}
      />

      {historyEvents &&
        selectedSemester !== null &&
        Object.entries(groupedEvents(selectedSemester) || {}).map(([month, events]) => (
          <div key={month} style={{ marginBottom: "20px" }}>
            <Typography variant="h6" style={{ color: "blue" }}>
              {month}
            </Typography>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
                maxWidth: "100%",
              }}
            >
              {events.map(({ id, title, start_date, location, duration_hours, type }) => (
                <div
                  key={id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    boxSizing: "border-box",
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" style={{ fontWeight: "bold" }}>
                    {title} - {dayjs(start_date).format("DD MMM YYYY")}
                  </Typography>
                  <div
                    style={{
                      borderTop: "1px solid #ddd",
                      paddingTop: "10px",
                      marginTop: "10px",
                      flexGrow: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                      }}
                    ></div>
                  </div>
                  <Typography variant="body2">Lugar: {location}</Typography>
                  <Typography variant="body2">Horas validadas: {duration_hours}</Typography>
                  <Typography
                    variant="body2"
                    style={{ color: type === "accepted" ? "green" : "red" }}
                  >
                    {statusTranslation(type)}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default EventHistory;
