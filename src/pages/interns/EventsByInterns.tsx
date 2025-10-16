import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IconButton, Tooltip } from "@mui/material";
import { getAllCompleteInternService } from "../../services/internService";
import { CompleteIntern } from "../../models/internsInterface";
import dataGridLocaleText from "../../locales/datagridLocaleEs";

const EventByInterns = () => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [students, setStudents] = useState<CompleteIntern[]>([]);
  const fetchInternsFull = async () => {
    try {
      const res = await getAllCompleteInternService();
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching complete students info", error);
    }
  };
  useEffect(() => {
    fetchInternsFull();
  }, []);

  const handleEditHoursOpen = (id: number) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  const handleEditHoursClose = () => {
    setDetailOpen(false);
    setSelectedId(null);
  };

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Código",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      headerClassName: "headerStyle",
      cellClassName: "cellStyle",
    },
    {
      field: "full_name",
      headerName: "Nombre",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      headerClassName: "headerStyle",
      cellClassName: "cellStyle",
    },
    {
      field: "completed_hours",
      headerName: "Horas Hechas",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      headerClassName: "headerStyle",
      cellClassName: "cellStyle",
      valueGetter: (params: GridRenderCellParams) => `${params} horas`,
    },
    {
      field: "pending_hours",
      headerName: "Horas Faltantes",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      headerClassName: "headerStyle",
      cellClassName: "cellStyle",
      valueGetter: (params: GridRenderCellParams) => `${params} horas`,
    },
    {
      field: "events",
      headerName: "Eventos",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      headerClassName: "headerStyle",
      renderCell: (params) => (
        <Tooltip title="Ver eventos" placement="bottom">
          <IconButton
            color="primary"
            aria-label="ver"
            onClick={() => handleEditHoursOpen(params.row.id)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <Typography variant="h4" color="primary" style={{ marginBottom: "10px" }}>
        {"Lista de Becarios\r"}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" style={{ marginBottom: "20px" }}>
        {"Eventos hechos por becarios\r"}
      </Typography>

      <div
        style={{
          height: 400,
          width: "100%",
          overflow: "auto",
        }}
      >
        <div
          style={{
            minWidth: "800px",
            height: "100%",
          }}
        >
          <DataGrid
            rows={students}
            columns={columns}
            localeText={dataGridLocaleText}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            getRowId={(row) => row.id}
            classes={{
              root: "bg-white dark:bg-gray-800",
              columnHeader: "bg-gray-200 dark:bg-gray-800 ",
              cell: "bg-white dark:bg-gray-800",
              row: "bg-white dark:bg-gray-800",
              columnHeaderTitle: "!font-bold text-center",
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>

      <Dialog
        open={detailOpen}
        onClose={handleEditHoursClose}
        aria-labelledby="edit-hours-dialog-title"
        sx={{ "& .MuiDialog-paper": { width: "500px", maxWidth: "80%" } }}
      >
        <DialogTitle id="edit-hours-dialog-title">
          <Typography variant="h5" align="center" color="primary" style={{ fontWeight: "bold" }}>
            {students.find((student) => student.id === selectedId)?.name}
            {" -"} {students.find((student) => student.id === selectedId)?.total_hours} {"horas\r"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleEditHoursClose}
            style={{ color: "#231F74", position: "absolute", right: 3, top: 11 }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedId && (
            <div>
              <table
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px",
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ddd",
                      }}
                    >
                      {"Evento\r"}
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px",
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ddd",
                      }}
                    >
                      {"Estado\r"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .find((student) => student.id === selectedId)
                    ?.events?.map((event, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px", border: "1px solid #ddd" }}>{event.title}</td>
                        <td
                          style={{
                            padding: "8px",
                            border: "1px solid #ddd",
                            color: event.is_supervisor ? "orange" : "blue",
                          }}
                        >
                          {event.is_supervisor ? "Supervisor" : "Participante"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventByInterns;
