import "../src/init.js"
import { useState ,useEffect} from 'react'
"@stellar/stellar-sdk"
import User from "./components/User.js"
import "./index.css"
import "./output.css"
import Dashboard from "./components/Dashboard.js"
import Benificiary from "./components/Benificiary.js"
import { rpc } from "@stellar/stellar-sdk";
import FreighterComponent from "./components/ConnectFreighter.js"
import { Link, Outlet, useNavigate } from "react-router-dom"
// import { PrismaClient } from "@prisma/client";
function App() {
  const server = new rpc.Server("https://soroban-testnet.stellar.org");
  // const prisma = new PrismaClient();
  let data ;
  let events = async()=>{
    data = await server.getEvents({
      startLedger:1704336,
      filters:[
        {
          type:'contract',
          contractIds:['CDI4ZCDFKSP2EYIBGRU376XXSEAMZZBJLZGTSNKLGGAAMTVPTC6F34N2'],
        }
      ]

    })
    console.log(data)
}
const navigate = useNavigate();
  return (
    <>  
    <div className="h-[5rem] flex justify-between border items-center border-b-slate-600 border-t-transparent border-l-transparent border-r-transparent">
    <img src="./logo-white-color.webp" alt="nothing" className="w-[12rem] h-10 mt-2 ml-5 cursor-pointer" onClick={()=>{navigate('/')}} /> <FreighterComponent/>
    </div>
    <Outlet/>
    </>
  ) 
} 

export default App
