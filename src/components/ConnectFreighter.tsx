import React, { useState, useEffect } from "react";
import { isAllowed, setAllowed, getUserInfo, isConnected, getPublicKey } from "@stellar/freighter-api";

function FreighterComponent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [freighterAllowed, setFreighterAllowed] = useState(false);

  useEffect(() => {
    async function checkFreighterStatus() {
      if (await isAllowed()) {
        setFreighterAllowed(true);
        const pk = await getPk();
        if (pk) {
          setLoggedIn(true);
          setPublicKey(pk);
        }
      } else {
        setFreighterAllowed(false);
      }
    }
    checkFreighterStatus();
  }, []);

  async function getPk() {
    const { publicKey } = await getUserInfo();
    return publicKey;
  }

  async function handleConnectClick() {
      try{
        if(!await isConnected()){
          alert("install Freighter wallet first !")
        }
        else{
          if(await isAllowed()){
            setLoggedIn(true)
            const pk = await getPublicKey();
            setPublicKey(pk);
          }
          else{
            const isAllowed = await setAllowed();
            if(isAllowed){
              setLoggedIn(true);
              const pk = await getPublicKey();
              setPublicKey(pk);
            }
          }
        }
      }catch(error){  
        alert(error);
      }
  }
  const disConnect = () => {
    setLoggedIn(false);
  };
  return (
    <div id="freighter-wrap" className="wrap" aria-live="polite">
      {loggedIn ? (
        <div
          className="dropdown bg-indigo-500 rounded-md p-2 border "
          title={publicKey}
        >
          <div tabIndex={0} role="button" className=" bg-indigo-500">
          {publicKey.slice(0,5)+"....."+publicKey.slice(-5)}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
          >
            <li onClick={disConnect}>
              <a>Disconnect</a>
            </li>
          </ul>
        </div>
      ) : (
        <div className="ellipsis">
            <button
              data-connect
              onClick={handleConnectClick}
              disabled={loggedIn}
              className="bg-indigo-500 rounded-md p-2 "
            >
              Connect
            </button>
        </div>
      )}
    </div>
  );
}

export default FreighterComponent;
