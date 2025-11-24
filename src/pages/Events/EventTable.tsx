/* eslint-disable no-console */
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert, Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import ContainerPage from "../../components/common/ContainerPage";
import { deleteEventService, getEventsInformationsService } from "../../services/eventsService";
import { EventInformations, EventNameSupervisor } from "../../models/eventInterface";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getInternData } from "../../services/internService";
import dataGridLocaleText from "../../locales/datagridLocaleEs";

const EventTable = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<EventInformations[]>();
  const [eventsSupervisor, setEventsSupervisor] = useState<EventNameSupervisor[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alert, setAlert] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const fetchEvents = async () => {
    const res = await getEventsInformationsService();
    if (res.success) {
      setEvents(res.data);
    }
  };

  const fetchEventsInterns = async () => {
    try {
      if (events) {
        const promises = events.map(async (event: EventInformations) => {
          const formattedStartDate = dayjs(event.start_date).format("DD/MM/YYYY");
          if (event.responsible_intern_id) {
            const res = await getInternData(event.responsible_intern_id);
            const eventNew: EventNameSupervisor = {
              ...event,
              start_date: formattedStartDate,
              name_supervisor: res.data ? `${res.data.name} ${res.data.lastname}` : "Ninguno",
            };
            return eventNew;
          } 
          const eventNew: EventNameSupervisor = {
            ...event,
            name_supervisor: "Ninguno",
          };
          return eventNew;
          
        });

        const updatedEventsSupervisor = await Promise.all(promises);
        setEventsSupervisor(updatedEventsSupervisor);
      }
    } catch (error) {
      console.error("Error fetching Intern:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events) {
      fetchEventsInterns();
    }
  }, [events]);

  const columns: GridColDef[] = [
    {
      field: "start_date",
      headerName: "Fecha",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderHeader: (params) => (
        <Tooltip title = "Fecha Inicio" placement = "bottom">
          <span style = {{ fontWeight: "bold" }}>{params.colDef.headerName}</span>
        </Tooltip>
      ),
    },
    {
      field: "title",
      headerName: "Nombre",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderHeader: (params) => (
        <Tooltip title = "Nombre del evento" placement = "bottom">
          <span style = {{ fontWeight: "bold" }}>{params.colDef.headerName}</span>
        </Tooltip>
      ),
    },
    {
      field: "name_supervisor",
      headerName: "Supervisor",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderHeader: (params) => (
        <Tooltip title = "Supervisor del Evento" placement = "bottom">
          <span style = {{ fontWeight: "bold" }}>{params.colDef.headerName}</span>
        </Tooltip>
      ),
    },
    {
      field: "pending_interns",
      headerName: "Solicitudes",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderHeader: (params) => (
        <Tooltip title = "Solicitudes de Becarios" placement = "bottom">
          <span style = {{ fontWeight: "bold" }}>{params.colDef.headerName}</span>
        </Tooltip>
      ),
    },
    {
      field: "accepted_interns",
      headerName: "Becarios",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderHeader: (params) => (
        <Tooltip title = "Becarios Seleccionados" placement = "bottom">
          <span style = {{ fontWeight: "bold" }}>{params.colDef.headerName}</span>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Tooltip title = "Ver detalles">
            <IconButton color = "primary" onClick = {() => handleView(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title = "Editar evento" placement = "bottom">
            <IconButton
              color = "primary"
              aria-label = "editar"
              onClick = {() => handleEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title = "Eliminar evento" placement = "bottom">
            <IconButton
              color = "secondary"
              aria-label = "eliminar"
              onClick = {() => handleClickOpen(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  const handleView = (id: number) => {
    const event = events?.find((event) => id === event.id);
    if (!event) {
      console.error("Evento no encontrado");
      return;
    }
    if (!event.end_cancellation_date) {
      console.error("Fecha fin de bajas no encontrada");
      return;
    }

    const endCancel = dayjs(event.end_cancellation_date);
    const today = dayjs();

    if (today.isAfter(endCancel)) {
      navigate(`/eventRegisters/${id}`);
    } else {
      navigate(`/interns/${id}`);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/editEvent/${id}`);
  };

  const handleClickOpen = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    const res = selectedId && (await deleteEventService(selectedId));
    if (res.success) {
      setAlert({
        severity: "success",
        message: "¡Evento eliminado con éxito!",
      });
    } else {
      setAlert({
        severity: "error",
        message: "No se pudo eliminar el evento",
      });
    }
    setSnackbarOpen(true);
    setOpen(false);
    fetchEvents();
  };

  return (
    <ContainerPage
      title = "Lista de Eventos"
      subtitle = "Resumen de los eventos programados y sus detalles"
      actions = {
        <Button
          variant = "contained"
          color = "secondary"
          onClick = {handleCreateEvent}
          startIcon = {<AddIcon />}
        >
          {"Agregar evento\r"}
        </Button>
      }
    >
      <div style = {{ width: "100%", overflowX: "auto" }}>
        <div style = {{ minWidth: "800px" }}>
          <DataGrid
            rows = {eventsSupervisor || []}
            columns = {columns}
            localeText = {dataGridLocaleText}
            getRowId = {(row) => row.id}
            autoHeight
            initialState = {{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            classes = {{
              root: "bg-white dark:bg-gray-800",
              columnHeader: "bg-gray-200 dark:bg-gray-800 ",
              cell: "bg-white dark:bg-gray-800",
              row: "bg-white dark:bg-gray-800",
              columnHeaderTitle: "!font-bold text-center",
            }}
            pageSizeOptions = {[5, 10]}
          />
          <ConfirmDialog
            open = {open}
            onClose = {handleClose}
            onConfirm = {handleDelete}
            title = "Confirmar eliminación"
            description = "¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
          />
          {alert && (
            <Snackbar open = {snackbarOpen} autoHideDuration = {6000} onClose = {handleSnackbarClose}>
              <Alert onClose = {handleSnackbarClose} severity = {alert.severity} sx = {{ width: "100%" }}>
                {alert.message}
              </Alert>
            </Snackbar>
          )}
        </div>
      </div>
    </ContainerPage>
  );
};

export default EventTable;
