import React from "react";
import { Navigate, LoaderFunction } from "react-router-dom";
import axios from "axios";

import AuthGuard from "./AuthGuard";
import RoleGuard from "./RoleGuard";
import AppErrorBoundary from "../components/common/AppErrorBoundary";
import Layout from "../layout/Layout";
import LoginPage from "../pages/auth/LoginPage";
import ErrorPage from "../pages/ErrorPage";
import { DashboardPage } from "../pages/dashboard/Dashboard";
import GraduationProcessPage from "../pages/graduation/GraduationProcessPage";
import ProfessorPage from "../pages/Professor/ProfessorPage";
import StudentPage from "../pages/Student/StudentsPage";
import EditStudentPage from "../pages/Student/EditStudentPage";
import CreateStudentPage from "../pages/Student/CreateStudentPage";
import ProcessInfoPage from "../pages/graduation/ProcessInfoPage";
import CreateProcessPage from "../pages/CreateGraduation/CreateProcessPage";
import Profile from "../pages/profile/Profile";
import EventsPage from "../pages/Events/EventsPage";
import CreateEventPage from "../pages/Events/CreateEventPage";
import UpdateEventForm from "../pages/Events/UpdateEventForm";
import InternsListPage from "../pages/interns/InternsListPage";
import EventHistory from "../components/cards/EventHistory";
import HoursPage from "../pages/ScholarshipHours/HoursPage";
import CompleteScholarshipHourPage from "../pages/CompleteScholarshipHour/CompleteScholarshipHourPage";
import MyEventsTable from "../pages/interns/MyEventsTable";
import EventsByInternsPage from "../pages/interns/EventsByInterns";
import EventRegisterPage from "../pages/Events/EventRegisterPage";
import UsersPage from "../pages/Users/UsersPage";
import AdministratorPage from "../pages/Administrator/AdministratorPage";
import ViewInternSupervisor from "../pages/supervisor/ViewInternSupervisor";

import { getProcess, getStudentById } from "../services/processServicer";

import { roles } from "../constants/roles";

const { ADMIN, PROFESSOR, STUDENT, INTERN, PROGRAM_DIRECTOR, SUPERVISOR } = roles;

const rootLoader: LoaderFunction = async () => {
  try {
    return await getProcess();
  } catch (error) {
    // Si hay un error 401, redirigir al login
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
      throw new Response("Unauthorized", { status: 401 });
    }
    throw error;
  }
};

const studentLoader: LoaderFunction = async ({ params }) => {
  try {
    return await getStudentById(Number(params.id));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
      throw new Response("Unauthorized", { status: 401 });
    }
    throw error;
  }
};

interface AppRoute {
  path?: string;
  index?: boolean;
  element: React.ReactNode;
  loader?: LoaderFunction;
  children?: AppRoute[];
  errorElement?: React.ReactNode;
}

const routes: AppRoute[] = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgotPassword", element: <LoginPage /> },
  { path: "/signup", element: <LoginPage /> },
  { path: "*", element: <ErrorPage /> },

  {
    element: <AuthGuard />,
    errorElement: <AppErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Layout />,
        errorElement: <AppErrorBoundary />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },

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
            loader: rootLoader,
            errorElement: <AppErrorBoundary />,
            element: (
              <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR, STUDENT]}>
                <GraduationProcessPage />
              </RoleGuard>
            ),
          },
          {
            path: "/createProcess",
            loader: rootLoader,
            errorElement: <AppErrorBoundary />,
            element: (
              <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
                <CreateProcessPage />
              </RoleGuard>
            ),
          },
          {
            path: "/studentProfile/:id",
            loader: studentLoader,
            errorElement: <AppErrorBoundary />,
            element: (
              <RoleGuard allowedRoles={[ADMIN, STUDENT, INTERN, SUPERVISOR, PROFESSOR]}>
                <ProcessInfoPage />
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
            loader: rootLoader,
            element: (
              <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
                <StudentPage />
              </RoleGuard>
            ),
          },
          {
            path: "/create-student",
            loader: rootLoader,
            element: (
              <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
                <CreateStudentPage />
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
            path: "/editEvent/:id_event",
            element: (
              <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
                <UpdateEventForm />
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
            path: "/EventHistory/:id_event",
            element: (
              <RoleGuard allowedRoles={[ADMIN, INTERN, SUPERVISOR]}>
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
            path: "/eventRegisters/:id_event",
            element: (
              <RoleGuard allowedRoles={[ADMIN, PROFESSOR, PROGRAM_DIRECTOR]}>
                <EventRegisterPage />
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
            path: "/CompleteScholarshipHour",
            element: (
              <RoleGuard allowedRoles={[ADMIN, STUDENT, PROGRAM_DIRECTOR]}>
                <CompleteScholarshipHourPage />
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
            path: "/administration",
            element: (
              <RoleGuard allowedRoles={[ADMIN]}>
                <AdministratorPage />
              </RoleGuard>
            ),
          },
          {
            path: "/users",
            element: (
              <RoleGuard allowedRoles={[ADMIN]}>
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
        ],
      },
    ],
  },
];

export default routes;
