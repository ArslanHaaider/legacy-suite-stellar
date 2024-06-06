import { getPublicKey } from "@stellar/freighter-api";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import WalletContext from "../context/walletContext";
import FreighterComponent from "./ConnectFreighter";

const MainMenue = ()=>{
    const walletContext = useContext(WalletContext);
    if (!walletContext) {
      throw new Error('FreighterComponent must be used within a WalletProvider');
    }
  
    const { walletLogin, publicKey } = walletContext;

    return  (
        <>
        <div className="w-full h-[30rem] flex justify-center items-center  text-legacyBlue">
      <div className="w-1/3 h-5/6 bg-slate-800 round-sm flex flex-col items-center justify-center bg-neutral-100 rounded-md">
        <h1 className="text-[2rem] text-center">Welcome to </h1>
        <img src="./logo-white-color.webp"  alt="nothing" className="w-5/6 mt-5 bg-[#062044]"/>
        <div className="mt-5 flex w-full justify-evenly flex-col">
            {walletLogin?<>
              <h2 className="mt-10 text-lg text-center font-bold">LOGIN AS:</h2>
              <div className="flex justify-evenly"><Link className="btn btn-info bg-button text-legacyBlue" to={'/user'}>Asset Owner</Link> 
            <Link className="btn btn-info bg-button text-legacyBlue" to={'/benificiary'}>Benificiary</Link></div>
              </>:<div className="flex justify-center items-center "><FreighterComponent/></div>}
        </div>
      </div>
    </div>
        </>
    )
}
export default MainMenue;