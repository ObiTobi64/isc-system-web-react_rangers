import { LoaderFunction, LoaderFunctionArgs, Navigate, Params } from "react-router-dom";
import Layout from "../layout/Layout";
import { DashboardPage } from "../pages/dashboard/Dashboard";
import RoleGuard from "./RoleGuard";
import { getProcess, getStudentById } from "../services/processServicer";
import CreateProcessPage from "../pages/CreateGraduation/CreateProcessPage";
import CreateEventPage from "../pages/Events/CreateEventPage";
import EventsPage from "../pages/Events/EventsPage";
import UpdateEventForm from "../pages/Events/UpdateEventForm";
import GraduationProcessPage from "../pages/graduation/GraduationProcessPage";
import ProcessInfoPage from "../pages/graduation/ProcessInfoPage";
import InternsListPage from "../pages/interns/InternsListPage";
import ProfessorPage from "../pages/Professor/ProfessorPage";
import Profile from "../pages/profile/Profile";
import CreateStudentPage from "../pages/Student/CreateStudentPage";
import EditStudentPage from "../pages/Student/EditStudentPage";
import StudentPage from "../pages/Student/StudentsPage";
import HoursPage from "../pages/ScholarshipHours/HoursPage";
import EventTable from "../pages/Events/EventTable";
import CompleteScholarshipHourPage from "../pages/CompleteScholarshipHour/CompleteScholarshipHourPage";
import MyEventsTable from "../pages/interns/MyEventsTable";
import "../style.css";
import UsersPage from "../pages/Users/UsersPage";
import AdministratorPage from "../pages/Administrator/AdministratorPage";
import EventHistory from "../components/cards/EventHistory";
import ViewInternSupervisor from "../pages/supervisor/ViewInternSupervisor";
import EventsByInternsPage from "../pages/interns/EventsByInterns";
import roles from "../constants/roles";
import EventRegisterPage from "../pages/Events/EventRegisterPage";

function loader() {
  return getProcess();
}

interface StudentParams extends Params {
  id: string;
}

const getStudentProcess: LoaderFunction = async ({ params }: LoaderFunctionArgs<StudentParams>) => {
  const studentId = Number(params.id);
  return getStudentById(studentId);
};
const { ADMIN, PROFESSOR, STUDENT, INTERN, PROGRAM_DIRECTOR, SUPERVISOR } = roles;

// TODO: check proper roles on routes
const protectedRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/dashboard",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, PROFESSOR, PROGRAM_DIRECTOR]}>
            <DashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: "/process",
        loader,
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR, STUDENT]}>
            <GraduationProcessPage />
          </RoleGuard>
        ),
      },
      {
        path: "/professors",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, PROGRAM_DIRECTOR, PROFESSOR]}>
            <ProfessorPage />
          </RoleGuard>
        ),
      },
      {
        path: "/students",
        loader,
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <StudentPage />
          </RoleGuard>
        ),
      },
      {
        path: "/edit-student/:id",
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <EditStudentPage />
          </RoleGuard>
        ),
      },
      {
        path: "/create-student",
        loader,
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <CreateStudentPage />
          </RoleGuard>
        ),
      },
      {
        path: "/studentProfile/:id",
        loader: getStudentProcess,
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR, PROFESSOR]}>
            <ProcessInfoPage />
          </RoleGuard>
        ),
      },
      {
        path: "/createProcess",
        loader,
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <CreateProcessPage />
          </RoleGuard>
        ),
      },
      {
        path: "/profile",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR]}>
            <Profile />
          </RoleGuard>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <RoleGuard
            allowedRoles={[ADMIN, STUDENT, PROFESSOR, PROGRAM_DIRECTOR, INTERN, SUPERVISOR]}
          >
            <Profile />
          </RoleGuard>
        ),
      },
      {
        path: "/events",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR]}>
            <EventsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/events/create",
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <CreateEventPage />
          </RoleGuard>
        ),
      },
      {
        path: "/interns/:id_event",
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <InternsListPage />
          </RoleGuard>
        ),
      },
      {
        path: "/editEvent/:id_event",
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <UpdateEventForm />
          </RoleGuard>
        ),
      },
      {
        path: "/EventHistory/:id_event",
        element: (
          <RoleGuard allowedRoles={[ADMIN, INTERN, SUPERVISOR]}>
            <EventHistory />
          </RoleGuard>
        ),
      },
      {
        path: "/scholarshipHours",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR]}>
            <HoursPage />
          </RoleGuard>
        ),
      },
      {
        path: "/programDirector",
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROGRAM_DIRECTOR]}>
            <EventTable />
          </RoleGuard>
        ),
      },
      {
        path: "/CompleteScholarshipHour",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, PROGRAM_DIRECTOR]}>
            <CompleteScholarshipHourPage />
          </RoleGuard>
        ),
      },
      {
        path: "/eventHistory",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR]}>
            <EventHistory />
          </RoleGuard>
        ),
      },
      {
        path: "/eventsByInterns",
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <EventsByInternsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/myEvents",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR]}>
            <MyEventsTable />
          </RoleGuard>
        ),
      },
      {
        path: "/eventRegisters/:id_event",
        element: (
          <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
            <EventRegisterPage />
          </RoleGuard>
        ),
      },
      {
        path: "/administration",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <AdministratorPage />
          </RoleGuard>
        ),
      },
      {
        path: "/users",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <UsersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/supervisor",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, SUPERVISOR]}>
            <ViewInternSupervisor />
          </RoleGuard>
        ),
      },
      {
        path: "/eventHistory",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR]}>
            <EventHistory />
          </RoleGuard>
        ),
      },
      {
        path: "/preInscriptions",
        element: (
          <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR]}>
            <MyEventsTable />
          </RoleGuard>
        ),
      },
    ],
  },
];

export default protectedRoutes;
