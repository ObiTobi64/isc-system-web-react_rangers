import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import routes from "./routes/generalRoutes";

function App() {
  const router = createBrowserRouter(routes as RouteObject[]);
  return <RouterProvider router={router} />;
}

export default App;
