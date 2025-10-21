/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { deleteUser, getUsers } from "../../services/usersService";
import ContainerPage from "../../components/common/ContainerPage";
import { getRoles } from "../../services/roleService";
import Role from "../../models/roleInterface";
import { User } from "../../models/userInterface";
import CreateUserPage from "../../components/users/CreateUserPage";
import RolePermissions from "../../models/rolePermissionInterface";
import Permission from "../../models/permissionInterface";
import { getPermissionById } from "../../services/permissionsService";
import HasPermission from "../../helper/permissions";
import dataGridLocaleText from "../../locales/datagridLocaleEs";

interface ProcessedUser extends User {
  fullName: string;
  roles: string[];
}

interface RolesAndPermissionsItem {
  role_name: string;
}

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ProcessedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ProcessedUser[]>([]);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isOpenCreate, setOpenCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filterRoles, setFilterRoles] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [addUserPermission, setAddUserPermission] = useState<Permission>();
  const [viewUserReport, setViewUserReport] = useState<Permission>();
  const [editUserPermission, setEditUserPermission] = useState<Permission>();
  const [deleteUserPermission, setDeleteUserPermission] = useState<Permission>();

  useEffect(() => {
    const fetchPermissions = async () => {
      const addUserResponse = await getPermissionById(22);
      const viewUserResponse = await getPermissionById(23);
      const editUserResponse = await getPermissionById(24);
      const deleteUserResponse = await getPermissionById(25);

      setAddUserPermission(addUserResponse.data[0]);
      setViewUserReport(viewUserResponse.data[0]);
      setEditUserPermission(editUserResponse.data[0]);
      setDeleteUserPermission(deleteUserResponse.data[0]);
    };

    fetchPermissions();
  }, []);

  const handleCreateUser = useCallback(() => {
    setUser(null);
    setOpenCreate(true);
  }, []);

  const handleView = useCallback(
    (id: number) => {
      navigate(`/profile/${id}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id: number) => {
      const editUser = users.find((userItem) => userItem.id === id) || null;
      setUser(editUser);
      setOpenCreate(true);
    },
    [users]
  );

  const handleClickDelete = useCallback((id: number) => {
    setSelectedUser(id);
    setOpenDelete(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setOpenDelete(false);
    setSelectedUser(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    const dataResponse = await getUsers();
    const usersResponse = dataResponse.data;

    const processedUsers: ProcessedUser[] = usersResponse.map((userItem: User) => {
      const userRoles: string[] = [];

      const { rolesAndPermissions } = userItem;
      if (rolesAndPermissions && typeof rolesAndPermissions === "object") {
        Object.values(rolesAndPermissions).forEach((roleItem: unknown) => {
          if (roleItem && typeof roleItem === "object" && "role_name" in roleItem) {
            const typedRoleItem = roleItem as RolesAndPermissionsItem;
            userRoles.push(typedRoleItem.role_name);
          }
        });
      }

      return {
        ...userItem,
        fullName: `${userItem.name} ${userItem.lastname} ${userItem.mothername}`,
        roles: userRoles,
      } as ProcessedUser;
    });

    setUsers(processedUsers);
    setFilteredUsers(processedUsers);
  }, []);

  const handleDelete = useCallback(async () => {
    if (selectedUser !== null) {
      try {
        await deleteUser(selectedUser);
        fetchUsers();
      } catch (error) {
        console.log(error);
      }
      handleCloseDelete();
    }
  }, [selectedUser, handleCloseDelete, fetchUsers]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  }, []);

  const handleSelectRoleChange = useCallback((event: { target: { value: string } }) => {
    const selectedRole = event.target.value;
    if (selectedRole === "reset") {
      setFilterRoles("");
      setSearch("");
    } else {
      setFilterRoles(selectedRole);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filteredData = users;

    if (search) {
      const lowercasedFilter = search.toLowerCase();
      filteredData = filteredData.filter((userItem: ProcessedUser) => {
        const codeName = `${userItem.code} ${userItem.name} ${userItem.lastname} ${userItem.mothername}`;

        return (
          userItem.name?.toLowerCase().includes(lowercasedFilter) ||
          userItem.lastname?.toLowerCase().includes(lowercasedFilter) ||
          userItem.code?.toString().includes(lowercasedFilter) ||
          codeName.toLowerCase().includes(lowercasedFilter)
        );
      });
    }

    if (filterRoles) {
      filteredData = filteredData.filter((userItem: ProcessedUser) =>
        userItem.roles?.includes(filterRoles)
      );
    }

    setFilteredUsers(filteredData);
  }, [users, search, filterRoles]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchRoles = useCallback(async () => {
    const rolesResponse = await getRoles();
    const rolesPermissions: RolePermissions = rolesResponse.data;
    const rolesList: Role[] = [];

    Object.keys(rolesPermissions).forEach((roleName: string) => {
      const rolePermissions = rolesPermissions[roleName];
      rolesList.push({
        id: rolePermissions.id,
        name: roleName,
        disabled: rolePermissions.disabled,
        permissions: rolePermissions.permissions,
      });
    });

    setRoles(rolesList);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const countUsersWithRole = useCallback(
    (roleName: string) => users.filter((userItem) => userItem.roles?.includes(roleName)).length,
    [users]
  );

  const createActionHandler = useCallback(
    // eslint-disable-next-line no-unused-vars
    (handler: (id: number) => void, id: number) => () => handler(id),
    []
  );

  const renderActions = useCallback(
    (params: GridRenderCellParams) => {
      const viewHandler = createActionHandler(handleView, params.row.id);
      const editHandler = createActionHandler(handleEdit, params.row.id);
      const deleteHandler = createActionHandler(handleClickDelete, params.row.id);

      return (
        <div>
          {HasPermission(viewUserReport?.name || "") && (
            <IconButton color = "primary" aria-label = "ver" onClick = {viewHandler}>
              <VisibilityIcon />
            </IconButton>
          )}
          {HasPermission(editUserPermission?.name || "") && (
            <IconButton color = "primary" aria-label = "editar" onClick = {editHandler}>
              <EditIcon />
            </IconButton>
          )}
          {HasPermission(deleteUserPermission?.name || "") && (
            <IconButton color = "secondary" aria-label = "eliminar" onClick = {deleteHandler}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      );
    },
    [
      viewUserReport,
      editUserPermission,
      deleteUserPermission,
      handleView,
      handleEdit,
      handleClickDelete,
      createActionHandler,
    ]
  );

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Código",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 200,
    },
    {
      field: "fullName",
      headerName: "Nombre Completo",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 200,
    },
    {
      field: "email",
      headerName: "Correo",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 200,
    },
    {
      field: "phone",
      headerName: "Teléfono",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 200,
    },
    {
      field: "rol",
      headerName: "Rol",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 200,
      renderCell: ({ row }: GridRenderCellParams) =>
        row.roles.map((rol: string) => (
          <Chip key = {rol} label = {rol} style = {{ color: "#ffffff", backgroundColor: "#337DD0" }} />
        )),
    },
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 200,
      renderCell: renderActions,
    },
  ];

  const handleCreateUserClose = useCallback(() => {
    fetchUsers();
    setOpenCreate(false);
  }, [fetchUsers]);

  const content = (
    <div style = {{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container spacing = {1} style = {{ paddingBottom: 20 }}>
        <Grid item xs = {9} md = {8}>
          <div className = "flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between m-5 mb-8 overflow-hidden">
            <label htmlFor = "table-search" className = "sr-only">
              {"Search\r"}
            </label>
            <div className = "relative">
              <div className = "absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <FaSearch className = "w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type = "text"
                id = "table-search"
                className = "block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder = "Buscar por código y nombre de estudiante"
                value = {search}
                onChange = {handleSearchChange}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs = {7} md = {4}>
          <FormControl fullWidth style = {{ paddingTop: 20 }}>
            <InputLabel style = {{ paddingTop: 13 }}>{"Rol"}</InputLabel>
            <Select
              fullWidth
              label = "Rol"
              style = {{ height: 40 }}
              onChange = {handleSelectRoleChange}
              value = {filterRoles}
            >
              <MenuItem value = "reset">{"Borrar búsqueda"}</MenuItem>
              {roles.map((rolItem: Role) => (
                <MenuItem key = {rolItem.id} value = {rolItem.name}>
                  {rolItem.name}
                  {" ("}
                  {countUsersWithRole(rolItem.name)}
                  {")\r"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx = {{ width: "100%" }}>
        <DataGrid
          rows = {filteredUsers}
          columns = {columns}
          localeText = {dataGridLocaleText}
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
      </Box>

      <Dialog
        open = {isOpenDelete}
        onClose = {handleCloseDelete}
        aria-labelledby = "alert-dialog-title"
        aria-describedby = "alert-dialog-description"
      >
        <DialogTitle id = "alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>

        <DialogContent>
          <DialogContentText id = "alert-dialog-description">
            {
              "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.\r"
            }
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick = {handleCloseDelete} color = "primary">
            {"Cancelar\r"}
          </Button>

          <Button onClick = {handleDelete} color = "secondary">
            {"Eliminar\r"}
          </Button>
        </DialogActions>
      </Dialog>

      {isOpenCreate && (
        <CreateUserPage openCreate = {isOpenCreate} handleClose = {handleCreateUserClose} user = {user} />
      )}
    </div>
  );

  return (
    <ContainerPage
      title = {`Usuarios (${users.length})`}
      subtitle = "Lista de usuarios"
      actions = {
        HasPermission(addUserPermission?.name || "Agregar usuario") && (
          <Button
            variant = "contained"
            color = "secondary"
            onClick = {handleCreateUser}
            startIcon = {<AddIcon />}
          >
            {"Agregar Usuario\r"}
          </Button>
        )
      }
    >
      {content}
    </ContainerPage>
  );
};

export default UsersPage;
