import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import "../../components/administration/AdministratorPageComponents.css";
import RoleTable from "../../components/administration/RoleTable";
import PermissionTable from "../../components/administration/PermissionTable";
import AddTextModal from "../../components/common/AddTextModal";
import { getRoles, addRole } from "../../services/roleService";
import { Role } from "../../models/roleInterface";
import { RolePermissions } from "../../models/rolePermissionInterface";

const AdministratorPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [title, setTitle] = useState("");
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const [currentRole, setCurrentRole] = useState<Role>({
    name: "",
    id: 0,
    disabled: false,
    permissions: [],
  });

  const extractRoles = (rolesData: RolePermissions) => {
    const rolesFetched: Role[] = [];
    Object.keys(rolesData).forEach((roleName: string) => {
      const rolePermissions = rolesData[roleName];
      rolesFetched.push({
        id: rolePermissions.id,
        name: roleName,
        disabled: rolePermissions.disabled,
        permissions: Array.isArray(rolePermissions.permissions)
          ? rolePermissions.permissions
          : [],
      });
    });
    return rolesFetched;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        const rolesFetched = extractRoles(rolesData.data);
        setRoles(rolesFetched);
        setTitle(rolesFetched[0].name);
        setCurrentRole(rolesFetched[0]);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleCreate = async (roleName: string, category: string) => {
    try {
      await addRole({ name: roleName, category });
      const updateRoles = await getRoles();
      const rolesFetched = extractRoles(updateRoles.data);
      setRoles(rolesFetched);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleRoleSelect = (roleName: string) => {
    setTitle(roleName);
    roles.forEach((role: Role) => {
      if (role.name === roleName) {
        setCurrentRole(role);
      }
    });
  };

  return (
    <Grid container spacing={3} sx={{ justifyContent: isSmall ? "center" : "flex-start" }}>
      <Grid item xs={12}>
        <Typography variant="h5" align="left" sx={{ marginBottom: 2 }}>
          <ManageAccountsIcon color="primary" fontSize="large" sx={{ marginRight: 2 }} />
          Permisos de {title}
        </Typography>
      </Grid>
      <Grid item xs={!isSmall ? 3 : 12}>
        <RoleTable
          roles={roles}
          onRoleSelect={handleRoleSelect}
          selectedRole={title}
          setIsModalVisible={setIsModalVisible}
        />
      </Grid>
      <Grid item xs={9}>
        {!isSmall && <PermissionTable currentRol={currentRole} />}
      </Grid>
      <AddTextModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        onCreate={handleCreate}
        existingRoles={roles}
      />
    </Grid>
  );
};

export default AdministratorPage;
