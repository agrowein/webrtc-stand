import {RouteObject} from "react-router";
import {SignUpPage} from "../pages/SignUp/SignUp.page";
import {SignInPage} from "../pages/SignIn/SignIn.page";
import {ContactsPage} from "../pages/Contacts/Contacts.page";
import {CallPage} from "../pages/Call/Call.page";
import {MainPage} from "../pages/Main/Main.page";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: '/sign-in',
        element: <SignInPage />,
      },
      {
        path: '/sign-up',
        element: <SignUpPage />,
      },
      {
        path: '/call/:id',
        element: <CallPage />,
      },
      {
        path: '/contacts',
        element: <ContactsPage />,
      },
    ],
  }
];

export default routes;