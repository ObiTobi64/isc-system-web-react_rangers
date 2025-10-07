import { Button, Typography, Avatar, Paper, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { HasPermission } from "../../../helper/permissions";
import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Permission from "../../../models/permissionInterface";
import { getPermissionById } from "../../../services/permissionsService";
import { UserResponse } from "../../../services/models/LoginResponse";

interface UserProfileCardProps {
  user: UserResponse;
}

const UserProfileCard: FC<UserProfileCardProps> = ({ user }) => {
  const [scheduleAppointmentPermissionStudent, setScheduleAppointmentPermissionStudent] =
    useState<Permission | null>(null);
  const [scheduleAppointmentPermissionProffesor, setScheduleAppointmentPermissionProfessor] =
    useState<Permission | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermissions = async () => {
      const scheduleAppointmentStudentResponse = await getPermissionById(17);
      setScheduleAppointmentPermissionStudent(scheduleAppointmentStudentResponse.data[0]);
      const scheduleAppointmentProfessorResponse = await getPermissionById(9);
      setScheduleAppointmentPermissionProfessor(scheduleAppointmentProfessorResponse.data[0]);
    };
    fetchPermissions();
  }, []);

  const hasProfessorPermission = HasPermission(scheduleAppointmentPermissionProffesor?.name || "");
  const hasStudentPermission = HasPermission(scheduleAppointmentPermissionStudent?.name || "");

  return (
  <>
    <IconButton
      onClick={() => navigate(-1)}
      sx={{
        display: "flex",
        top: -19,
        width: 20,
        height:0,
      }}
    >
      <ArrowBackIcon  />
    </IconButton>
    <Paper
      elevation={5}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        backgroundColor: "white",
        borderRadius: 5,
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ position: "relative", mb: 2 }}>
        <Avatar
          alt={user?.name}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYuwSeW_wPuwldJSnYf2ibAvVG2zmARUwSBw&s"
          sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }}
        />
        <Button
          variant="text"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            minWidth: 0,
            padding: 0.5,
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            borderRadius: "50%",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <EditIcon fontSize="small" />
        </Button>
      </Box>
      <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>
        {user?.name} {user?.lastname} {user?.mothername}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2, textAlign: "center" }}>
        {user?.roles}
      </Typography>
      {(hasProfessorPermission || hasStudentPermission) && (
        <Button variant="contained" color="primary" sx={{ mb: 3 }}>
          Agendar una reunión
        </Button>
      )}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          padding: 2,
          marginBottom: 2,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
          borderColor: "#f6f6f6",
          borderWidth: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Email
        </Typography>
        <Typography variant="body1">{user?.email}</Typography>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          padding: 2,
          marginBottom: 2,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
          borderColor: "#f6f6f6",
          borderWidth: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Código
        </Typography>
        <Typography variant="body1">{user?.code}</Typography>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          padding: 2,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
          borderColor: "#f6f6f6",
          borderWidth: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Número de teléfono
        </Typography>
        <Typography variant="body1">{user?.phone}</Typography>
      </Paper>
    </Paper>
  </>
  );
};

export default UserProfileCard;
