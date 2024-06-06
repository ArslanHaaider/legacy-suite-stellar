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
// import { Err } from '@stellar/stellar-sdk/contract';
import Benificiary from './components/Benificiary.tsx';
import WalletProvider from './context/provider/walletProvider.tsx';
import Claimed from './components/Claimed.tsx';
import UnClaimed from './components/UnClaimed.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <WalletProvider><App/></WalletProvider>,
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
      errorElement:<ErrorPage/>,
      children:[{
        path:'/benificiary/Claimed',
        element:<Claimed/>,
        errorElement:<ErrorPage/>,
    },{
        path:"/benificiary/UnClaimed",
        element:<UnClaimed/>,
        errorElement:<ErrorPage/>,
    }]
    }
  ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
 
    <RouterProvider router={router} />
  
)
