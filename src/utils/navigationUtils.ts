import { roles } from '../constants/roles';

const { ADMIN, PROFESSOR, STUDENT, INTERN, PROGRAM_DIRECTOR, SUPERVISOR } = roles;
const getDefaultHomeRoute = (userRoles: string[]): string => {
  const dashboardRoles = [ADMIN, STUDENT, PROFESSOR, PROGRAM_DIRECTOR];
  const hasDashboardAccess = userRoles.some((role) => dashboardRoles.includes(role));

  if (hasDashboardAccess) {
    return '/dashboard';
  }

  if (userRoles.includes(INTERN) || userRoles.includes(SUPERVISOR)) {
    return '/events';
  }

  return '/dashboard';
};

export default getDefaultHomeRoute;
