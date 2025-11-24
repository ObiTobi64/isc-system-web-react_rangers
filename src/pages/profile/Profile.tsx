import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Grid, Paper, Box, Tab, Tabs } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import UserProfileCard from "./component/UserProfileCard";
import { getUserById } from "../../services/usersService";
import TaskList from "./component/TaskList";
import SpinModal from "../../components/common/SpinModal";
import TutoringCard from "./component/TutoringCard";
import StudentCard from "./component/StudentCard";
import { UserResponse } from "../../services/models/LoginResponse";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role = "tabpanel"
      hidden = {value !== index}
      id = {`simple-tabpanel-${index}`}
      aria-labelledby = {`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx = {{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchUserProfile = async (id: string) => {
    try {
      const response = await getUserById(Number(id));
      setUserProfile(response.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserProfile(id);
    }
  }, [id]);

  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loading) {
    return <SpinModal />;
  }

  if (error || !userProfile) {
    return <Navigate to = "/ErrorPage" replace />;
  }

  return (
    <Box sx = {{ flexGrow: 1, p: 2 }}>
      <Grid container spacing = {2} justifyContent = "center">
        <Grid
          item xs = {12} sm = {9}
          md = {3}>
          <UserProfileCard user = {userProfile} />
        </Grid>
        <Grid item xs = {12} md = {9}>
          <Grid container spacing = {2}>
            {userProfile &&
              Array.isArray(userProfile.roles) &&
              userProfile.roles.includes("professor") && (
              <Grid item xs = {12}>
                <TutoringCard />
              </Grid>
            )}
            {userProfile &&
              Array.isArray(userProfile.roles) &&
              userProfile.roles.includes("student") && (
              <Grid item xs = {12}>
                <StudentCard />
              </Grid>
            )}
            <Grid item xs = {12}>
              <Paper elevation = {3} sx = {{ p: 2 }}>
                <Box
                  sx = {{
                    borderBottom: 1,
                    borderColor: "divider",
                    overflowX: "auto",
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  {userProfile &&
                    Array.isArray(userProfile.roles) &&
                    userProfile.roles.includes("professor") && (
                    <Tabs
                      value = {value}
                      onChange = {handleChange}
                      variant = "scrollable"
                      scrollButtons = "auto"
                    >
                      <Tab label = "Tutorias" {...a11yProps(0)} />
                      <Tab label = "Revisiones" {...a11yProps(1)} />
                    </Tabs>
                  )}
                  {userProfile &&
                    Array.isArray(userProfile.roles) &&
                    userProfile.roles.includes("student") && (
                    <Tabs
                      value = {value}
                      onChange = {handleChange}
                      variant = "scrollable"
                      scrollButtons = "auto"
                    >
                      <Tab label = "Horas becarias" {...a11yProps(0)} />
                      <Tab label = "Certificaciones" {...a11yProps(1)} />
                      <Tab label = "Procesos de graduación" {...a11yProps(2)} />
                    </Tabs>
                  )}
                </Box>
                <CustomTabPanel value = {value} index = {0}>
                  <TaskList />
                </CustomTabPanel>
                <CustomTabPanel value = {value} index = {1}>
                  <TaskList />
                </CustomTabPanel>
                <CustomTabPanel value = {value} index = {2}>
                  <TaskList />
                </CustomTabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
