import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Box from "@mui/material/Box";
import barData from "../../data/graphicData";

export default function GraphicHours() {
  const getFillColor = (hours: number): string => (hours < 50 ? "#FF0000" : "#4CAF50");
  return (
    <Box
      sx = {{
        width: "100%",
        flexGrow: 1,
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ResponsiveContainer width = "100%" aspect = {1}>
        <BarChart width = {600} height = {450} data = {barData}>
          <CartesianGrid strokeDasharray = "3 3" />
          <XAxis dataKey = "semester" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey = "hours">
            {barData.map((entry, index) => (
              <Cell key = {`cell-${index}`} fill = {getFillColor(entry.hours)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
