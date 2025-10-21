/* eslint-disable camelcase */
/* eslint-disable no-console */
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event, EventDetails } from "../../models/eventInterface";
import EventDetailsPage from "../../components/common/EventDetailsPage";
import { getFullEventInformationService, updateInternType } from "../../services/eventsService";
import internRegisterStates from "../../constants/internRegisterStates";
import dataGridLocaleText from "../../locales/datagridLocaleEs";

interface FullEvent extends Event {
  interns: any[];
}

const InternsListPage = () => {
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [event, setEvent] = useState<FullEvent>();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const { id_event } = useParams<{ id_event: string }>();
  const { ACCEPTED, REJECTED, PENDING, RESERVE } = internRegisterStates;

  const handleStatusChange = async (id_intern: number, newStatus: string) => {
    if (!id_event) {
      console.error("Could not find id_event");
      return;
    }
    try {
      await updateInternType(parseInt(id_event), id_intern, {
        type: newStatus,
      });
    } catch (error) {
      console.error(error);
    }
    fetchFullEvent();
  };

  const fetchFullEvent = async () => {
    const res = id_event && (await getFullEventInformationService(id_event));
    if (res.success) {
      setEvent(res.data);
    }
  };

  const setupEventDetails = () => {
    if (event) {
      const details: EventDetails = {
        title: event.title,
        date: dayjs(event.start_date),
        endDate: dayjs(event.end_date),
        duration: event.duration_hours,
        scholarshipHours: event.assigned_hours.toString(),
        location: event.location,
        maxParticipants: event.max_interns,
        minParticipants: event.min_interns,
        responsiblePerson: event.responsible_intern_id?.toString() || "",
        description: event.description || "",
        status: "PENDIENTE",
      };
      setEventDetails(details);
    }
  };

  const setupStudents = () => {
    const studentList =
      event &&
      event.interns.map((intern) => ({
        id: intern.id_intern,
        name: `${intern.name} ${intern.lastname} ${intern.mothername}`,
        code: intern.code,
        time: dayjs(intern.registration_date).format("DD/MM/YYYY HH:mm"),
        status: intern.type,
        hours: intern.worked_hours.toString(),
      }));
    setStudents(studentList || []);
  };

  useEffect(() => {
    fetchFullEvent();
  }, [id_event]);

  useEffect(() => {
    setupEventDetails();
    setupStudents();
  }, [event]);

  const handleAddStudentOpen = () => {
    setAddStudentOpen(true);
  };

  const handleAddStudentClose = () => {
    setAddStudentOpen(false);
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((studentId) => studentId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAddStudents = () => {
    handleAddStudentClose();
  };

  const availableStudents = students;

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre del becario/a",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "code",
      headerName: "Código",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "time",
      headerName: "Hora de registro",
      type: "string",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Estado de inscripción",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Select
          fullWidth
          value = {params.value}
          onChange = {(e) => handleStatusChange(params.row.id, e.target.value)}
          variant = "standard"
          sx = {{
            minHeight: 0,
            lineHeight: 1.5,
            padding: "2px 8px",
            "& .MuiSelect-select": {
              padding: 0,
              fontSize: "0.875rem",
            },
            "& .MuiInputBase-root": {
              margin: 0,
            },
          }}
        >
          <MenuItem value = {ACCEPTED}>{"Aceptado"}</MenuItem>
          <MenuItem value = {REJECTED}>{"Rechazado"}</MenuItem>
          <MenuItem value = {RESERVE}>{"Suplente"}</MenuItem>
          <MenuItem value = {PENDING}>{"Pendiente"}</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <div style = {{ position: "relative", height: "100vh", padding: "19px" }}>
      <IconButton
        onClick = {() => window.history.back()}
        aria-label = "back"
        style = {{
          position: "absolute",
          top: "17px",
          left: "5px",
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Button
        variant = "contained"
        color = "primary"
        onClick = {handleAddStudentOpen}
        startIcon = {<AddIcon />}
        style = {{
          position: "absolute",
          top: "17px",
          right: "30px",
          zIndex: 1,
          backgroundColor: "#005b8f",
          color: "#fff",
          marginBottom: "25px",
          marginRight: "20px",
          marginLeft: "40px",
        }}
      >
        {"Agregar Estudiante\r"}
      </Button>
      {eventDetails && (
        <EventDetailsPage
          event = {event!}
          children = {
            <div style = {{ width: "100%", overflowX: "auto" }}>
              <div style = {{ minWidth: "800px" }}>
                <DataGrid
                  rows = {students}
                  columns = {columns}
                  localeText = {dataGridLocaleText}
                  initialState = {{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions = {[5, 10]}
                  classes = {{
                    root: "bg-white dark:bg-gray-800",
                    columnHeader: "bg-gray-200 dark:bg-gray-800",
                    cell: "bg-white dark:bg-gray-800",
                    row: "bg-white dark:bg-gray-800",
                    columnHeaderTitle: "!font-bold text-center",
                  }}
                />
                <Dialog
                  open = {addStudentOpen}
                  onClose = {handleAddStudentClose}
                  aria-labelledby = "add-student-dialog-title"
                  maxWidth = "sm"
                  fullWidth
                >
                  <DialogTitle id = "add-student-dialog-title">
                    {"Agregar Nuevo Becario\r"}
                    <IconButton
                      aria-label = "close"
                      onClick = {handleAddStudentClose}
                      style = {{
                        color: "#231F74",
                        position: "absolute",
                        right: 13,
                        top: 11,
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                    <Typography
                      variant = "subtitle2"
                      color = "textSecondary"
                      style = {{ marginTop: "8px" }}
                    >
                      {"Selecciona los becarios para agregar\r"}
                    </Typography>
                  </DialogTitle>
                  <DialogContent>
                    {availableStudents.length > 0 ? (
                      availableStudents.map((student) => (
                        <MenuItem
                          key = {student.id}
                          onClick = {() => handleSelectStudent(student.id)}
                          style = {{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{student.name}</Typography>
                          <Checkbox
                            checked = {selectedStudents.includes(student.id)}
                            color = "primary"
                          />
                        </MenuItem>
                      ))
                    ) : (
                      <Typography>{"No hay becarios disponibles para agregar."}</Typography>
                    )}
                  </DialogContent>
                  <DialogActions style = {{ marginRight: "15px", marginTop: "-1%" }}>
                    <Button
                      onClick = {handleAddStudentClose}
                      style = {{
                        backgroundColor: "#231F74",
                        color: "#fff",
                      }}
                    >
                      {"Cancelar\r"}
                    </Button>
                    <Button
                      onClick = {handleAddStudents}
                      style = {{
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                      }}
                    >
                      {"Agregar\r"}
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default InternsListPage;
