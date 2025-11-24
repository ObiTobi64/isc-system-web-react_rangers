import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";
import { Box, Button, IconButton, Paper, TextField, useTheme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Student } from "../../models/studentInterface";
import { getPermissionById } from "../../services/permissionsService";
import Permission from "../../models/permissionInterface";
import HasPermission from "../../helper/permissions";
import dataGridLocaleText from "../../locales/datagridLocaleEs";
import ContainerPage from "../../components/common/ContainerPage";
import ProcessForm from "../CreateGraduation/components/ProcessForm";

const GraduationProcessPage = () => {
  const [filteredData, setFilteredData] = useState<Student[] | []>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const studentsResponse = useLoaderData() as {
    data: Student[];
    message: string;
  };
  const { data: students } = studentsResponse;
  const navigate = useNavigate();
  const [createProcess, setCreateProcess] = useState<Permission>();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchCreateProcess = async () => {
      const response = await getPermissionById(3);
      setCreateProcess(response.data[0]);
    };
    fetchCreateProcess();
  }, []);

  useEffect(() => {
    const results = students.filter((item: Student) =>
      item.student_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(results);
  }, [search, students]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    const limitedValue = sanitizedValue.slice(0, 50);
    setSearch(limitedValue);
  }, []);

  const goToCreateProcessPage = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  const handleViewStudent = useCallback(
    (studentId: string) => {
      navigate(`/studentProfile/${studentId}`);
    },
    [navigate]
  );

  const tableHeaders: GridColDef[] = [
    {
      field: "student_name",
      headerName: "Estudiante",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      maxWidth: 300,
      flex: 1,
      resizable: true,
    },
    {
      field: "period",
      headerName: "Periodo",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      maxWidth: 200,
      flex: 1,
      resizable: true,
    },
    {
      field: "tutor_name",
      headerName: "Tutor",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      maxWidth: 250,
      flex: 1,
      resizable: true,
    },
    {
      field: "reviewer_name",
      headerName: "Revisor",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      maxWidth: 250,
      flex: 1,
      resizable: true,
    },
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 140,
      filterable: false,
      sortable: false,
      minWidth: 100,
      resizable: false,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            aria-label="ver"
            onClick={() => handleViewStudent(params.row.id)}
          >
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <ContainerPage
      title="Procesos de Graduación"
      subtitle="Lista de procesos de graduación de los estudiantes"
      actions={
        HasPermission(createProcess?.name || "") && (
          <Button
            variant="contained"
            color="secondary"
            onClick={goToCreateProcessPage}
            startIcon={<AddIcon />}
            size={isSmallScreen ? "small" : "medium"}
          >
            {"Nuevo Proceso\r"}
          </Button>
        )
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 3,
          width: "100%",
        }}
      >
        <TextField
          type="text"
          placeholder="Buscar por nombre de estudiante"
          value={search}
          onChange={handleSearchChange}
          size={isSmallScreen ? "small" : "medium"}
          multiline
          maxRows={3}
          sx={{
            width: isSmallScreen ? "100%" : "600px",
            "& .MuiOutlinedInput-root": {
              pr: 1,
              "&:hover fieldset": { borderColor: "secondary.main" },
              "&.Mui-focused fieldset": { borderColor: "secondary.main" },
            },
            "& input": { outline: "none !important", boxShadow: "none !important" },
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: "text.secondary" }}>
                <FaSearch />
              </Box>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Paper>
          <DataGrid
            autoHeight
            disableColumnResize={false}
            rows={filteredData}
            columns={tableHeaders}
            localeText={dataGridLocaleText}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#e5e7eb",
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
                border: "none !important",
                boxShadow: "none !important",
              },
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                outline: "none !important",
                border: "none !important",
                boxShadow: "none !important",
              },
              "& .MuiDataGrid-cell--editing": {
                boxShadow: "none !important",
              },
              "& .MuiDataGrid-cell.MuiDataGrid-cell--editing": {
                outline: "none !important",
              },
              "& .MuiDataGrid-cell": {
                borderColor: "transparent",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "inherit !important",
              },
            }}
            classes={{
              root: "bg-white dark:bg-gray-800",
              columnHeader: "bg-gray-200 dark:bg-gray-800",
              cell: "bg-white dark:bg-gray-800",
              row: "bg-white dark:bg-gray-800",
              columnHeaderTitle: "!font-bold text-center",
            }}
            slotProps={{
              columnsManagement: {
                autoFocusSearchField: false,
                searchInputProps: {
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "secondary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "secondary.main",
                      },
                    },
                    "& input": {
                      outline: "none !important",
                      boxShadow: "none !important",
                    },
                  },
                },
              },
            }}
          />
        </Paper>
      </Box>
      <ProcessForm isVisible={open} isClosed={handleClose}></ProcessForm>
    </ContainerPage>
  );
};

export default GraduationProcessPage;
