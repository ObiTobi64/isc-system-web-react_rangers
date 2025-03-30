import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import ContainerPage from "../../components/common/ContainerPage";
import SpinModal from "../../components/common/SpinModal";
import { useEffect, useState } from "react";
import { getMentors } from "../../services/mentorsService";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Permission } from "../../models/permissionInterface";
import { getPermissionById } from "../../services/permissionsService";
import { HasPermission } from "../../helper/permissions";
import dataGridLocaleText from "../../locales/datagridLocaleEs";

const ProfessorPage = () => {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [addProfessorPermission, setAddProfessorPermission] = useState<Permission>();
  const [viewProfessorReportPermission, setViewProfessorReportPermission] = useState<Permission>();
  const [deleteProfessorPermission, setDeleteProfessorPermission] = useState<Permission>();
  const [editProfessorPermission, setEditProfessorPermission] = useState<Permission>();

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    code: true, 
    degree: true,
    name: true,
    lastName: true,
    phone: true,
    tutorias: true,
    revisiones: true,
    actions: true,
  });
  

  useEffect(() => {
    const fetchPermissions = async () => {
      const addProfessorResponse = await getPermissionById(7);
      setAddProfessorPermission(addProfessorResponse.data[0]);
      const viewProfessorReportResponse = await getPermissionById(8);
      setViewProfessorReportPermission(viewProfessorReportResponse.data[0]);
      const deleteProfessorResponse = await getPermissionById(10);
      setDeleteProfessorPermission(deleteProfessorResponse.data[0]);
      const editProfessorResponse = await getPermissionById(11);
      setEditProfessorPermission(editProfessorResponse.data[0]);
      setIsLoading(false); 
    };

    fetchPermissions();
    fetchProfessors();
  }, []);

  const hasViewPermission = HasPermission(viewProfessorReportPermission?.name || "");
  const hasEditPermission = HasPermission(editProfessorPermission?.name || "");
  const hasDeletePermission = HasPermission(deleteProfessorPermission?.name || "");

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Código",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      resizable: true,
    },
    {
      field: "degree",
      headerName: "Título",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      resizable: true,
    },
    {
      field: "name",
      headerName: "Nombre",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      resizable: true,
    },
    {
      field: "lastName",
      headerName: "Apellido",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      resizable: true,
    },
    {
      field: "phone",
      headerName: "Celular",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
      resizable: true,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            textAlign: "center",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "tutorias",
      headerName: "Tutorías",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 180,
      maxWidth: 200,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: 200,
            textAlign: "center",
            lineHeight: "1.2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {params.value ? (
            params.value
          ) : (
            <span style={{ textAlign: "center" }}>
              No existen<br />tutorías registradas
            </span>
          )}
        </div>
      ),
    },
    {
      field: "revisiones",
      headerName: "Revisiones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 180,
      maxWidth: 200,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: 200,
            textAlign: "center",
            lineHeight: "1.2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value ? (
            params.value
          ) : (
            <span style={{ textAlign: "center" }}>
              No existen<br />revisiones disponibles
            </span>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const hasActions = hasViewPermission || hasEditPermission || hasDeletePermission;
        return hasActions ? (
          <div>
            {hasViewPermission && (
              <IconButton color="primary" onClick={() => handleView(params.row.id)}>
                <VisibilityIcon />
              </IconButton>
            )}
            {hasEditPermission && (
              <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
                <EditIcon />
              </IconButton>
            )}
            {hasDeletePermission && (
              <IconButton color="secondary" onClick={() => handleClickOpen(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        ) : (
          "No hay acciones disponibles"
        );
      },
    },
  ];


  interface VisibilityChangeModel {
    [key: string]: boolean;
  }

  const handleColumnVisibilityChange = (newModel: VisibilityChangeModel): void => {
    const visibleColumns = Object.entries(newModel).filter(([isVisible]) => isVisible);
    
    if (visibleColumns.length === 0) {
      const firstColumn = Object.keys(columnVisibilityModel)[0]; 
      newModel[firstColumn] = true; 
    }
  
    setColumnVisibilityModel((prevModel) => ({ ...prevModel, ...newModel }));
  };
  
  
  const handleCreateTeacher = () => {
    navigate("/create-professor");
  };

  const fetchProfessors = async () => {
    const professors = await getMentors();
    setProfessors(professors.data);
    console.log(professors);
    setIsLoading(false); 
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleView = (id: number) => {
    navigate(`/profile/${id}`);
    console.log(`Ver estudiante con id: ${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-student/${id}`);
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
    if (selectedId !== null) {
      try {
        console.log(`Eliminar docente con id: ${selectedId}`);
      } catch (error) {
        console.log(error);
      } finally {
        handleClose();
      }
    }
  };

  return (
    <ContainerPage
      title={"Docentes"}
      subtitle={"Lista de docentes"}
      actions={
        HasPermission(addProfessorPermission?.name || "") && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateTeacher}
            startIcon={<AddIcon />}
            style={{ display: "inline-flex" }}
          >
            Agregar docente
          </Button>
        )
      }
      children={
        isLoading ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "55%",
            }}
          >
            <SpinModal />
          </div>
        ) : (
          <div style={{ width: "100%", paddingBottom: 0 }}>
            <DataGrid
              rows={professors}
              columns={columns}
              localeText={dataGridLocaleText}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={handleColumnVisibilityChange}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              disableColumnReordering
              disableColumnSorting
              autoHeight
              classes={{
                root: "bg-white dark:bg-gray-800",
                columnHeader: "bg-gray-200 dark:bg-gray-800",
                cell: "bg-white dark:bg-gray-800",
                row: "bg-white dark:bg-gray-800",
                columnHeaderTitle: "!font-bold text-center",
              }}
              sx={{
                "& .MuiDataGrid-cell:focus": {
                  outline: "none !important",
                },
                "& .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
                "& .MuiDataGrid-virtualScroller": {
                  minHeight: "0px",
                  overflow: "hidden",
                },
                "& .MuiDataGrid-main": {
                  overflow: "hidden",
                  paddingBottom: 0,
                },
                "& .MuiDataGrid-footerContainer": {
                  minHeight: "auto",
                  marginBottom: 0,
                },
              }}
            />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  ¿Estás seguro de que quieres eliminar este docente?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancelar
                </Button>
                <Button onClick={handleDelete} color="secondary" autoFocus>
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
      }
    />
  );
};

export default ProfessorPage;