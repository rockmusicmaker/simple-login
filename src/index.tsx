import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { RegisterAccount, Login } from "src/pages";

const router = createBrowserRouter([
  { path: "/", element: <Login registerRoute="/register" /> },
  {
    path: "/register",
    element: <RegisterAccount homeRoute="/" />,
  },
  {
    path: "*",
    element: <Navigate to={"/"} />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RouterProvider router={router} />);
