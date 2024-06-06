import React, { useState, useEffect, useContext } from "react";
import { isAllowed, setAllowed, getUserInfo, isConnected, getPublicKey, requestAccess } from "@stellar/freighter-api";
import WalletContext from "../context/walletContext";

function FreighterComponent() {
  const [freighterAllowed, setFreighterAllowed] = useState(false);
  const walletContext = useContext(WalletContext);

  if (!walletContext) {
    throw new Error('FreighterComponent must be used within a WalletProvider');
  }

  const { walletLogin, setWalletLogin, publicKey, setPublicKey } = walletContext;

  useEffect(() => {
    async function checkFreighterStatus() {
      if (await isAllowed()) {
        setFreighterAllowed(true);
        const pk = await getPk();
        if (pk) {
          setWalletLogin(true);
          setPublicKey(pk);
        }
      } else {
        setFreighterAllowed(false);
      }
    }
    checkFreighterStatus();
  }, [setWalletLogin, setPublicKey]);

  async function getPk() {
    const { publicKey } = await getUserInfo();
    return publicKey;
  }

  async function handleConnectClick() {
    try {
      if (!await isConnected()) {
        alert("Install Freighter wallet first!");
      } else {
        if (await isAllowed()) {
          setWalletLogin(true);
          const pk = await getPublicKey();
          setPublicKey(pk);
        } else {
          const isAllowed = await setAllowed();
          if (isAllowed) {
            setWalletLogin(true);
            const pk = await getPublicKey();
            setPublicKey(pk);
          }
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  const disConnect = () => {
    setWalletLogin(false);
    console.log(walletLogin); 
  };

  return (
    <div id="freighter-wrap" className="wrap" aria-live="polite">
      {walletLogin ? (
        <div
          className="dropdown bg-indigo-500 rounded-md p-2 border font-semibold   text-black bg-button"
          title={publicKey}
        >
          <div tabIndex={0} role="button" className="text-[#062044] ">
            {publicKey.slice(0, 5) + "....." + publicKey.slice(-5)}
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
            disabled={walletLogin}
            className="btn btn-info bg-button text-legacyBlue"
          >
            Connect
          </button>
        </div>
      )}
    </div>
  );
}

export default FreighterComponent;
