import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EventIcon from "@mui/icons-material/Event";
import ViewListIcon from "@mui/icons-material/ViewList";
import HistoryIcon from "@mui/icons-material/History";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

import roles from "./roles";

const { ADMIN, PROFESSOR, STUDENT, INTERN, PROGRAM_DIRECTOR, SUPERVISOR } = roles;
const menu = [
  // TODO: check roles on sidebar
  {
    key: "users",
    path: "/users",
    text: "Usuarios",
    icon: <SwitchAccountIcon color="primary" />,
    roles: [ADMIN],
  },
  {
    key: "students",
    path: "/students",
    text: "Estudiantes",
    icon: <SchoolOutlinedIcon color="primary" />,
    roles: [PROFESSOR, PROGRAM_DIRECTOR],
  },
  {
    key: "professors",
    path: "/professors",
    text: "Docentes",
    icon: <SupervisorAccountIcon color="primary" />,
    roles: [PROFESSOR, STUDENT],
  },
  {
    key: "process",
    path: "/process",
    text: "Procesos",
    icon: <ChecklistOutlinedIcon color="primary" />,
    roles: [ADMIN, PROGRAM_DIRECTOR, PROFESSOR, STUDENT],
  },
  {
    key: "events",
    path: "/events",
    text: "Eventos",
    icon: <EventIcon color="primary" />,
    roles: [ADMIN, STUDENT, INTERN, SUPERVISOR],
  },
  {
    key: "hours",
    path: "/scholarshipHours",
    text: "Horas",
    icon: <AccessTimeIcon color="primary" />,
    roles: [STUDENT, INTERN, SUPERVISOR],
  },
  {
    key: "programDirector",
    path: "/programDirector",
    text: "Lista de Eventos",
    icon: <EmojiPeopleIcon color="primary" />,
    roles: [ADMIN, PROGRAM_DIRECTOR],
  },
  {
    key: "supervisor",
    path: "/supervisor",
    text: "Supervisor",
    icon: <SupervisedUserCircleIcon color="primary" />,
    roles: [SUPERVISOR],
  },
  {
    key: "CompleteScholarship",
    path: "/CompleteScholarshipHour",
    text: "Eventos",
    icon: <PendingActionsIcon color="primary" />,
    roles: [ADMIN, PROGRAM_DIRECTOR],
  },
  {
    key: "administration",
    path: "/administration",
    text: "Roles y permisos",
    icon: <ManageAccountsIcon color="primary" />,
    roles: [ADMIN],
  },

  {
    key: "viewInterns",
    path: "/eventsByInterns",
    text: "Inscritos",
    icon: <ViewListIcon color="primary" />,
    roles: [ADMIN, PROGRAM_DIRECTOR, PROFESSOR],
  },
  {
    key: "dashboard",
    path: "/dashboard",
    text: "Dashboard",
    icon: <HomeIcon color="primary" />,
    roles: [ADMIN, PROGRAM_DIRECTOR, PROFESSOR, STUDENT],
  },
  {
    key: "eventHistory",
    path: "/eventHistory",
    text: "Historial",
    icon: <HistoryIcon color="primary" />,
    roles: [ADMIN, STUDENT, INTERN, SUPERVISOR],
  },
  {
    key: "preInscriptions",
    path: "/preInscriptions",
    text: "Pre-Inscripciones",
    icon: <InsertInvitationIcon color="primary" />,
    roles: [STUDENT, INTERN, SUPERVISOR],
  },
  {
    key: "create-student",
    path: "/create-student",
    text: "Crear Becario",
    icon: <InsertInvitationIcon color="primary" />,
    roles: [ADMIN, PROGRAM_DIRECTOR],
  },
];

export default menu;
