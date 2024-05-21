import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import ErrorPage from './Error.tsx';
import User from './components/User.tsx';
import MainMenue from './components/MainMenu.tsx';
import { Err } from '@stellar/stellar-sdk/contract';
import Benificiary from './components/Benificiary.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
    errorElement:<ErrorPage/>,
    children:[{
      path:"/user",
      element:<User/>,
      errorElement:<ErrorPage/>
    },{
      path:"/",
      element:<MainMenue/>,
      errorElement:<ErrorPage/>
    },{
      path:"/benificiary",
      element:<Benificiary/>,
      errorElement:<ErrorPage/>
    }
  ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
