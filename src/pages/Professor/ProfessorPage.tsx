import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import ContainerPage from "../../components/common/ContainerPage";
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
    },
    {
      field: "degree",
      headerName: "Título",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Nombre",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Apellido",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Celular",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "tutorias",
      headerName: "Tutorías",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 180,
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
          {params.value ? params.value : (<span style={{ textAlign: "center",
          }}>No existen<br />tutorías registradas</span>)}
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
          {params.value ? params.value : (<span style={{textAlign: "center",
           }}>No existen<br />revisiones disponibles</span>)}
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
    const visibleColumns = Object.entries(newModel).filter(([, isVisible]) => isVisible);
    
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
      actions={ HasPermission(addProfessorPermission?.name || "") &&
        (<Button
          variant="contained"
          color="secondary"
          onClick={handleCreateTeacher}
          startIcon={<AddIcon />}
          style={{display: "inline-flex"}}
        >
          Agregar docente
        </Button>)
      }
      children={
        <div style={{ height: 400, width: "100%" }}>
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
            classes={{
              root: "bg-white dark:bg-gray-800",
              columnHeader: "bg-gray-200 dark:bg-gray-800 ",
              cell: "bg-white dark:bg-gray-800",
              row: "bg-white dark:bg-gray-800",
              columnHeaderTitle: "!font-bold text-center",
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            sx={{
              
              "& .MuiDataGrid-cell": {
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none !important",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
            }}
          />
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirmar eliminación"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Estás seguro de que deseas eliminar este docente? Esta acción
                no se puede deshacer.
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
      }
    ></ContainerPage>
  );
};

export default ProfessorPage;
