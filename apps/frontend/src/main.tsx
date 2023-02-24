import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import BulkUpload from "./pages/BulkUpload";
import ErrorPage from "./pages/ErrorPage";
import ComparisonCharts from "./pages/ComparisonCharts";
import TimeseriesCharts from "./pages/TimeseriesCharts";

const queryClient = new QueryClient();
const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "upload",
        element: <BulkUpload />,
      },
      {
        path: "charts/comparison",
        element: <ComparisonCharts />,
      },
      {
        path: "charts/timeseries",
        element: <TimeseriesCharts />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
