import React from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";

// components
import PrivateRoute from "./PrivateRoute";
// import Root from './Root';

// lazy load all the views








/************************************************************************************************************************************** */
const HrDashboard = React.lazy(() => import("../pages/dashboard/HrDashboard"));
const Dashboard = React.lazy(() => import("../pages/dashboard/index"));
const ProfileTest = React.lazy(() => import("../pages/ProfilePack/Profile"));
const Setting = React.lazy(() => import("../pages/setting/index"))


const Assets = React.lazy(() => import("../pages/Assets/index"))
const AssetsNew = React.lazy(() => import("../pages/Assets/NewAssets/index"))
const AssetsDetail = React.lazy(() => import("../pages/Assets/DetailAssets/index"))
const AssetsUpdate = React.lazy(() => import("../pages/Assets/UpdateAssets/index"))



const ListEmployee = React.lazy(() => import("../pages/Employee/List/index"))
const ListWaitingEmployee = React.lazy(() => import("../pages/Employee/List/WaitingList"))
const ListRoleEmployee = React.lazy(() => import("../pages/Employee/List/Role"))
const NewEmployee = React.lazy(() => import("../pages/Employee/New/index"))
const WaitingEmployeeDetail = React.lazy(() => import("../pages/Employee/detail/waitingEmployee"))
const WaitingEmployeeRoleDetail = React.lazy(() => import("../pages/Employee/detail/WaitingPost"))
const EmployeeDetail = React.lazy(() => import("../pages/Employee/detail/index"))
const PersonalInfo = React.lazy(() => import("../pages/Employee/update/PersonalInfo"))
const NewEmployeeRole = React.lazy(() => import("../pages/Employee/update/NewEmployeeRole"))
const EmployeeRole = React.lazy(() => import("../pages/Employee/update/EmployeeRole"))

const NewRequest = React.lazy(() => import("../pages/Request/New/index"))
const ListRequest = React.lazy(() => import("../pages/Request/ReceptionBox/index"))
const DetailRequest = React.lazy(() => import("../pages/Request/detail/index"))
const DetailLeaveRequest = React.lazy(() => import("../pages/Request/detail/leaveDetail"))



const Invalide = React.lazy(() => import("../pages/Pointage/Invalide"))
const Pointage = React.lazy(() => import("../pages/Pointage/Pointage"))
/************************************************************************************************************************************* */




// auth
const Login = React.lazy(() => import("../pages/auth/Login"));
const Logout = React.lazy(() => import("../pages/auth/Logout"));
const Confirm = React.lazy(() => import("../pages/auth/Confirm"));
const ForgetPassword = React.lazy(() => import("../pages/auth/ForgetPassword"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const SignInSignUp = React.lazy(() => import("../pages/auth/SignInSignUp"));
const LockScreen = React.lazy(() => import("../pages/auth/LockScreen"));



export interface RoutesProps {
  path: RouteProps["path"];
  name?: string;
  element?: RouteProps["element"];
  route?: any;
  exact?: boolean;
  icon?: string;
  header?: string;
  roles?: string[];
  children?: RoutesProps[];
}

// root routes
// const rootRoute: RoutesProps = {
//     path: '/',
//     exact: true,
//     element: () => <Root />,
//     route: Route,
// };

// dashboards
const dashboardRoutes: RoutesProps = {
  path: "/dashboard",
  name: "Dashboards",
  icon: "airplay",
  header: "Navigation",
  children: [
    /*------------------------------------------------------- */
    /***************** Setting system ************************* */
    {
      path: "/setting",
      name: "Root",
      element: <Setting />,
      route: PrivateRoute,
    },
    /******************************************************** */

    {
      path: "/",
      name: "Root",
      element: <HrDashboard />,
      route: PrivateRoute,
    },

    {
      path: "/dashboard-test",
      name: "Root",
      element: <Dashboard />,
      route: PrivateRoute,
    },

    /*------------------------------------------------------- */
    /***************** profile user ************************* */
    {
      path: "/profile",
      name: "Root",
      element: <ProfileTest />,
      route: PrivateRoute,
    },
    /******************************************************** */


    /*------------------------------------------------------- */
    /***************** assets list ************************* */
    {
      path: "/Assets",
      name: "Root",
      element: <Assets />,
      route: PrivateRoute,
    },

    /***************** new assets  *************************** */
    {
      path: "/assets/new",
      name: "Root",
      element: <AssetsNew />,
      route: PrivateRoute,
    },
    /****************** assets detail ************************ */
    {
      path: "/assets/detail/:id",
      name: "Root",
      element: <AssetsDetail />,
      route: PrivateRoute,
    },
    /****************** assets detail ************************ */
    {
      path: "/assets/update/:id",
      name: "Root",
      element: <AssetsUpdate />,
      route: PrivateRoute,
    },
    /*------------------------------------------------------- */
    /*------------------------------------------------------- */
    /****************** employee list *********************** */
    {
      path: "/employee/list/",
      name: "Root",
      element: <ListEmployee />,
      route: PrivateRoute,
    },

    /************** waiting employee list ******************* */
    {
      path: "/employee/waiting/list/",
      name: "Root",
      element: <ListWaitingEmployee />,
      route: PrivateRoute,
    },

     /****************** employee list *********************** */
     {
      path: "/employee/pending/list/",
      name: "Root",
      element: <ListRoleEmployee />,
      route: PrivateRoute,
    },
    /**************  employee detail ************************ */
    {
      path: "/employee/detail/:id",
      name: "Root",
      element: <EmployeeDetail />,
      route: PrivateRoute,
    },
    /**************  employee detail ************************ */
    {
      path: "/employee/update/personalInfo/:id",
      name: "Root",
      element: <PersonalInfo />,
      route: PrivateRoute,
    },

    {
      path: "/employee/update/post/:employee_id/:id?",
      name: "Root",
      element: <EmployeeRole />,
      route: PrivateRoute,
    },

    {
      path: "/employee/form/role/:employee_id/:id?",
      name: "Root",
      element: <NewEmployeeRole />,
      route: PrivateRoute,
    },


    




    /************** waiting employee list ******************* */
    {
      path: "/employee/waiting/detail/:id",
      name: "Root",
      element: <WaitingEmployeeDetail />,
      route: PrivateRoute,
    },


    {
      path: "/employee/pending/detail/:id",
      name: "Root",
      element: <WaitingEmployeeRoleDetail />,
      route: PrivateRoute,
    },


    /*------------------------------------------------------- */
    /*------------------------------------------------------- */
    /****************** employee list *********************** */
    {
      path: "/employee/new/",
      name: "Root",
      element: <NewEmployee />,
      route: PrivateRoute,
    },
    /****************** employee list *********************** */
    {
      path: "/employee/waiting/update/:id",
      name: "Root",
      element: <NewEmployee />,
      route: PrivateRoute,
    },






    /*------------------------------------------------------- */

    /*------------------------------------------------------- */
    /*------------------------------------------------------- */
    /****************** request list ************************ */
    {
      path: "/request",
      name: "Root",
      element: <ListRequest />,
      route: PrivateRoute,
    },
    {
      path: "/request/new",
      name: "Root",
      element: <NewRequest />,
      route: PrivateRoute,
    },
    {
      path: "/request/detail/:id",
      name: "Root",
      element: <DetailRequest />,
      route: PrivateRoute,
    },
    {
      path: "/request/leave/detail/:id",
      name: "Root",
      element: <DetailLeaveRequest />,
      route: PrivateRoute,
    },

/****************** employee list *********************** */
{
  path: "/invalide/",
  name: "Root",
  element: <Invalide />,
  route: PrivateRoute,
},
{
  path: "/pointage/",
  name: "Root",
  element: <Pointage />,
  route: PrivateRoute,
},
    /* {
       path: "/",
       name: "Root",
       element: <Navigate to="/dashboard-1" />,
       route: PrivateRoute,
     },
     {
       path: "/dashboard-1",
       name: "Dashboard 1",
       element: <Dashboard1 />,
       route: PrivateRoute,
     },
     {
       path: "/dashboard-2",
       name: "Dashboard 2",
       element: <Dashboard2 />,
       route: PrivateRoute,
     },
     {
       path: "/dashboard-3",
       name: "Dashboard 3",
       element: <Dashboard3 />,
       route: PrivateRoute,
     },
     {
       path: "/dashboard-4",
       name: "Dashboard 4",
       element: <Dashboard4 />,
       route: PrivateRoute,
     },*/
  ],
};




// auth
const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login",
    element: <Login />,
    route: Route,
  },
  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
    route: Route,
  },
  {
    path: "/auth/confirm",
    name: "Confirm",
    element: <Confirm />,
    route: Route,
  },
  {
    path: "/auth/forget-password",
    name: "Forget Password",
    element: <ForgetPassword />,
    route: Route,
  },
  {
    path: "/auth/signin-signup",
    name: "SignIn-SignUp",
    element: <SignInSignUp />,
    route: Route,
  },
  {
    path: "/auth/lock-screen",
    name: "Lock Screen",
    element: <LockScreen />,
    route: Route,
  },
  {
    path: "/auth/logout",
    name: "Logout",
    element: <Logout />,
    route: Route,
  },



];


// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = [];

  routes = routes || [];
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item);

    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });
  return flatRoutes;
};

// All routes
const authProtectedRoutes = [
  dashboardRoutes,

];
const publicRoutes = [...authRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export {
  publicRoutes,
  authProtectedRoutes,
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
};
