import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/User/login";
import Profile from "./pages/User/profile";
import Stuff from "./pages/Stuff/index";
import StuffCreate from "./pages/Stuff/create";
import Dashboard from "./pages/Dashboard";
import StuffEdit from "./pages/Stuff/edit";
import StuffTrash from "./pages/Stuff/trash";
import Inbound from "./pages/Inbound/index";
import InboundCreate from "./pages/Inbound/create";
import Users from "./pages/Users/index";
import UsersCreate from "./pages/Users/create";
import UsersEdit from "./pages/Users/edit";
import UsersTrash from "./pages/Users/trash";
import Lending from "./pages/Lending/index";
import LendingCreate from "./pages/Lending/create";
import Restoration from "./pages/Lending/restoration";

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/login', element: <Login /> },
    { path: '/profile', element: <Profile /> },
    { path: '/stuff', element: <Stuff /> },
    { path: '/stuff/create', element: <StuffCreate /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/stuff/edit/:id', element: <StuffEdit /> },
    { path: '/stuff/trash', element: <StuffTrash /> },
    { path: '/inbound', element: <Inbound /> },
    { path: '/inbound/create', element: <InboundCreate /> },
    { path: '/users', element: <Users /> },
    { path: '/users/create', element: <UsersCreate /> },
    { path: '/users/edit/:id', element: <UsersEdit /> },
    { path: '/users/trash', element: <UsersTrash /> },
    { path: '/lending', element: <Lending /> },
    { path: '/lending/create', element: <LendingCreate /> },
    { path: '/lending/restoration/:id', element: <Restoration /> },
])