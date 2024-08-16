import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  Navigate,
} from "react-router-dom";
import { CreateAccount, Login } from "src/pages";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/register",
    element: <CreateAccount homeRoute="/" />,
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
