import "../src/init.js"
"@stellar/stellar-sdk"
import "./index.css"
import { rpc } from "@stellar/stellar-sdk";
import FreighterComponent from "./components/ConnectFreighter.js"
import {Outlet, useNavigate } from "react-router-dom"
// import { PrismaClient } from "@prisma/client";
function App() {
  const server = new rpc.Server("https://soroban-testnet.stellar.org");
  // const prisma = new PrismaClient();
  let data ;
  let events = async()=>{
    data = await server.getEvents({
      startLedger:1736429,
      filters:[
        {
          type:'contract',
          contractIds:['CD2DBQBMGTDVZIMYZ2NYAW5ZVBZNQF6DHYB74QKXXH4D3HQAS7G5QWTX'],

        }
      ]

    })
    console.log();
}
const navigate = useNavigate();
  return (
    <>  
  <div className="bg-[#062044] h-[100vh] tracking-wide">
  <div className="h-[5rem] flex justify-between  items-center  ">
    <img src="./logo-white-color.webp" alt="nothing" className="w-[15rem] h-10 mt-2 ml-5 cursor-pointer" onClick={()=>{navigate('/')}} /> <FreighterComponent/>
    </div>
    {/* <button ></button> */}
    <Outlet/>
  </div>
    {/* <button onClick={events}>Get Events</button> */}
    </>
  )   
} 

export default App
