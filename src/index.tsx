import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { RegisterAccount, Login, Home } from "src/pages";

const ROUTES = { login: "/", register: "/register", home: "/home" };

const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: <Login registerRoute={ROUTES.register} homeRoute={ROUTES.home} />,
  },
  {
    path: ROUTES.register,
    element: <RegisterAccount loginRoute={ROUTES.login} />,
  },
  { path: ROUTES.home, element: <Home loginRoute={ROUTES.login} /> },
  {
    path: "*",
    element: <Navigate to={"/"} />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);
