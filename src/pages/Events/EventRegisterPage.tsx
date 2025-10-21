/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useCallback, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { Chip, TextField } from "@mui/material";
import { FullEvent } from "../../models/eventInterface";
import EventDetailsPage from "../../components/common/EventDetailsPage";
import { getFullEventInformationService, updateInternType } from "../../services/eventsService";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import dataGridLocaleText from "../../locales/datagridLocaleEs";

const EventRegisterPage = () => {
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [event, setEvent] = useState<FullEvent>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [students, setStudents] = useState<any[]>([]);
  const [editHoursOpen, setEditHoursOpen] = useState(false);
  const [newHours, setNewHours] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { id_event } = useParams<{ id_event: string }>();

  const fetchFullEvent = useCallback(async () => {
    if (!id_event) {
      return;
    }

    const res = await getFullEventInformationService(id_event);
    if (res.success) {
      setEvent(res.data);
    }
  }, [id_event]);

  const setupStudents = useCallback(() => {
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
  }, [event]);

  useEffect(() => {
    fetchFullEvent();
  }, [fetchFullEvent]);

  useEffect(() => {
    setupStudents();
  }, [setupStudents]);

  const handleAddStudentOpen = useCallback(() => {
    setAddStudentOpen(true);
  }, []);

  const handleAddStudentClose = useCallback(() => {
    setAddStudentOpen(false);
  }, []);

  const handleSelectStudent = useCallback((id: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((studentId) => studentId !== id)
        : [...prevSelected, id]
    );
  }, []);

  const handleAddStudents = useCallback(() => {
    handleAddStudentClose();
  }, [handleAddStudentClose]);

  const availableStudents = students;

  const handleEditHoursClick = useCallback((id: number, currentHours: string) => {
    setSelectedId(id);
    setNewHours(currentHours);
    setEditHoursOpen(true);
  }, []);

  const createEditButtonHandler = useCallback((id: number, hours: string) => () => {
    handleEditHoursClick(id, hours);
  }, [handleEditHoursClick]);

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
      headerName: "Estado",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const statusMap: { [key: string]: any } = {
          pending: { label: "PENDIENTE", color: "default" },
          accepted: { label: "ACEPTADO", color: "success" },
          reserve: { label: "RESERVA", color: "info" },
          rejected: { label: "RECHAZADO", color: "error" },
        };

        const status = statusMap[params.value];

        return <Chip label = {status.label} color = {status.color} sx = {{ fontWeight: 600 }} />;
      },
    },
    {
      field: "hours",
      headerName: "Horas Becarias",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => `${params.value} horas`,
    },
    {
      field: "edit",
      headerName: "Editar",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant = "contained"
          onClick = {createEditButtonHandler(params.row.id, params.row.hours)}
        >
          {"Editar\r"}
        </Button>
      ),
    },
  ];

  const handleHoursSave = useCallback(async () => {
    if (!id_event || !selectedId) {
      console.error("Error on ids");
      return;
    }
    try {
      await updateInternType(parseInt(id_event, 10), selectedId, {
        worked_hours: parseInt(newHours, 10),
      });
    } catch (error) {
      console.error(error);
    }
    fetchFullEvent();
    setEditHoursOpen(false);
    setSelectedId(null);
  }, [id_event, selectedId, newHours, fetchFullEvent]);

  const handleEditHoursClose = useCallback((_?: object, reason?: string) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    setEditHoursOpen(false);
    setSelectedId(null);
  }, []);

  const handleHoursChange = useCallback((currentEvent: ChangeEvent<HTMLInputElement>) => {
    const { value } = currentEvent.target;
    if (/^\d*$/.test(value) && (value === "" || parseInt(value, 10) <= 168)) {
      setNewHours(value);
    }
  }, []);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  const createStudentSelectHandler = useCallback(
    (studentId: number) => () => {
      handleSelectStudent(studentId);
    },
    [handleSelectStudent]
  );

  const backButtonStyles = {
    position: "absolute" as const,
    top: "17px",
    left: "5px",
  };

  const addButtonStyles = {
    position: "absolute" as const,
    top: "17px",
    right: "17px",
    zIndex: 1,
    backgroundColor: "#005b8f",
    color: "#fff",
  };

  const closeButtonStyles = {
    color: "#231F74",
    position: "absolute" as const,
    right: 7,
    top: 10,
  };

  const cancelButtonStyles = {
    backgroundColor: "#231F74",
    color: "#fff",
  };

  const addConfirmButtonStyles = {
    backgroundColor: "#d32f2f",
    color: "#fff",
  };

  return (
    <div style = {{ position: "relative", height: "100vh", padding: "19px" }}>
      <IconButton onClick = {handleBackClick} aria-label = "back" style = {backButtonStyles}>
        <ArrowBackIcon />
      </IconButton>
      <Button
        variant = "contained"
        color = "primary"
        onClick = {handleAddStudentOpen}
        startIcon = {<AddIcon />}
        style = {addButtonStyles}
      >
        {"Agregar Estudiante\r"}
      </Button>
      {event && (
        <EventDetailsPage event = {event}>
          <div style = {{ marginTop: "60px", height: 400, width: "100%" }}>
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
                columnHeaderTitle: "!font-bold text-center whitespace-normal p-2",
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
                  style = {closeButtonStyles}
                >
                  <CancelIcon />
                </IconButton>
                <Typography variant = "subtitle2" color = "textSecondary" style = {{ marginTop: "8px" }}>
                  {"Selecciona los becarios para agregar\r"}
                </Typography>
              </DialogTitle>
              <DialogContent>
                {availableStudents.length > 0 ? (
                  availableStudents.map((student) => (
                    <MenuItem
                      key = {student.id}
                      onClick = {createStudentSelectHandler(student.id)}
                      style = {{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>{student.name}</Typography>
                      <Checkbox checked = {selectedStudents.includes(student.id)} color = "primary" />
                    </MenuItem>
                  ))
                ) : (
                  <Typography>{"No hay becarios disponibles para agregar."}</Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick = {handleAddStudentClose} style = {cancelButtonStyles}>
                  {"Cancelar\r"}
                </Button>
                <Button onClick = {handleAddStudents} style = {addConfirmButtonStyles}>
                  {"Agregar\r"}
                </Button>
              </DialogActions>
            </Dialog>
            <ConfirmDialog
              open = {editHoursOpen}
              onClose = {handleEditHoursClose}
              onConfirm = {handleHoursSave}
              title = "Editar horas becarias"
              description = "Ingrese el nuevo valor asignado"
            >
              <TextField
                type = "text"
                value = {newHours}
                onChange = {handleHoursChange}
                label = "Horas Becarias"
                margin = "normal"
                sx = {{ marginRight: 2, marginLeft: 2 }}
                inputProps = {{ min: 0, inputMode: "numeric" }}
              />
            </ConfirmDialog>
          </div>
        </EventDetailsPage>
      )}
    </div>
  );
};

export default EventRegisterPage;
