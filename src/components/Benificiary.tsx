import FreighterComponent from "./ConnectFreighter";
import AddAdmin from "./AddAdmin";
import { useEffect, useState } from "react";
import { xdr, Address } from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";
import { getPublicKey } from "@stellar/freighter-api";
import UnClaimed from "./UnClaimed";
import { Link, Outlet, Router, useNavigate, useRoutes } from "react-router-dom";
const Benificiary = () => {
    const navigate = useNavigate();
    const [selectButton,setSelectButton] = useState(false)
    const [selectButton2,setSelectButton2] = useState(true)

    useEffect(()=>{
        navigate("./claimed")
    },[])
  return (
    <>
      {/* <h1 className="text-center font-bold text-3xl">DashBoard</h1> */}
      <div className="w-full min-h-screen flex justify-evenly items-center">
        <div className="w-full min-h-screen bg flex">
          <div className="w-1/5 min-h-screen  bg-[#FDFDFD]">
            <div className="text-center p-3 ml-8 bg-white text-sm flex justify-evenly items-center w-4/5">
              <span>
                <img src="/dashboard.png" alt="" width={25} />
              </span>
              <p className="text-base">My Dashboard</p>
            </div>
            <h1 className="text-left font-bold pl-4 pt-4 text-[#1D232A] text-lg">
              Benificiary
            </h1>
            <div className="w-full h-1/3  flex flex-col items-center justify-evenly text-sm">
              <Link to={"./Unclaimed"} onClick={() => {
  setSelectButton((prev) => {
    if (!prev) {
      setSelectButton2(false)
      return true;
    }
    return prev;
  });
}} className={selectButton?"flex justify-evenly items-center w-2/3 font-medium text-[#1D232A]":"flex justify-evenly items-center w-2/3 font-medium"}>
                {" "}
                <span>
                  <img src="/monitoring.png" alt="" width={25} />
                </span>
                <p className="text-base">Unclaimed</p>
              </Link>
              <Link to={"./claimed"} onClick={() => {
  setSelectButton2((prev) => {
    if (!prev) {
      setSelectButton(false)
      return true;

    }
    return prev;
  });
}} className={selectButton2?"flex justify-evenly items-center w-2/3 font-medium text-[#1D232A]":"flex justify-evenly items-center w-2/3"}>
                <span>
                  <img src="/backup.png" alt="" width={25} />
                </span>
                <p className="text-base" >Claimed</p>
              </Link>
            </div>
          </div>
         <div className="w-full min-h-screen bg-[#ffff]">
         <Outlet />
         </div>
        </div>
      </div>
    </>
  );
};

export default Benificiary;
