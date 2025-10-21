import { Box, Grid, Typography, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const tasks = [
  {
    date: "29",
    month: "Sep",
    task: "Plumbing",
    time: "11:00-19:30",
    status: "Cancelled",
    amount: 50,
    rate: 10,
  },
  {
    date: "15",
    month: "Oct",
    task: "Carpenting",
    time: "13:45-15:30",
    status: "Booked",
    amount: 345,
    rate: 45,
  },
  {
    date: "11",
    month: "Nov",
    task: "Painting",
    time: "9:00-12:30",
    status: "Done",
    amount: 130,
    rate: 55,
  },
  {
    date: "13",
    month: "Apr",
    task: "Hair Drying",
    time: "11:00-15:30",
    status: "Done",
    amount: 50,
    rate: 5,
  },
  {
    date: "24",
    month: "Feb",
    task: "Blue Print Structure",
    time: "10:00-19:30",
    status: "Booked",
    amount: 80,
    rate: 22,
  },
];

const TaskList = () => (
  <Box
    sx = {{
      maxHeight: "400px",
      overflowY: "auto",
      padding: 2,
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#cccccc",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "#aaaaaa",
      },
    }}
  >
    {tasks.map((task, index) => (
      <Grid
        container
        key = {index}
        spacing = {2}
        alignItems = "center"
        sx = {{ mb: 2, padding: 2, borderBottom: "1px solid #e0e0e0" }}
      >
        <Grid item xs = {2}>
          <Typography variant = "h6" component = "div">
            {task.date}
          </Typography>
          <Typography variant = "body2" color = "textSecondary">
            {task.month}
          </Typography>
        </Grid>
        <Grid item xs = {4}>
          <Typography variant = "body1" sx = {{ fontWeight: "bold" }}>
            {task.task}
          </Typography>
          <Typography variant = "body2" color = "textSecondary">
            {task.time}
          </Typography>
        </Grid>
        <Grid item xs = {3}>
          {task.status === "Cancelled" ? (
            <Chip label = "Cancelled" sx = {{ backgroundColor: "#ffe0b2", color: "#f57c00" }} />
          ) : task.status === "Booked" ? (
            <Chip label = "Booked" sx = {{ backgroundColor: "#e3f2fd", color: "#2196f3" }} />
          ) : (
            <Chip
              icon = {<CheckCircleIcon style = {{ color: "#4caf50" }} />}
              label = "Done"
              sx = {{ backgroundColor: "#e8f5e9", color: "#4caf50" }}
            />
          )}
        </Grid>
        <Grid item xs = {3} sx = {{ textAlign: "right" }}>
          <Typography variant = "body1" sx = {{ fontWeight: "bold" }}>
            {"$"}
            {task.amount}
          </Typography>
          <Typography variant = "body2" color = "textSecondary">
            {"$"}
            {task.rate}
            {"/hr\r"}
          </Typography>
        </Grid>
      </Grid>
    ))}
  </Box>
);

export default TaskList;
