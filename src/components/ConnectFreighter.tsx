import React, { useState, useEffect } from 'react';
import { isAllowed, setAllowed, getUserInfo } from '@stellar/freighter-api';

function FreighterComponent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState('');
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
    if (!freighterAllowed) {
      try {
        await setAllowed();
        const pk = await getPk();
        if (pk) {
          setLoggedIn(true);
          setPublicKey(pk);
        }
      } catch (error) {
        console.error('Error while setting allowed:', error);
      }
    }
  }

  return (
    <div id="freighter-wrap" className="wrap" aria-live="polite">
      {loggedIn ? (
        <div className="ellipsis" title={publicKey}>
          Signed in as {publicKey}
        </div>
      ) : (
        <div className="ellipsis">
          {freighterAllowed ? (
            <button data-connect onClick={handleConnectClick} disabled={loggedIn}>
              Connect
            </button>
          ) : (
            <button data-connect onClick={handleConnectClick}>
              Sign in & refresh the page
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FreighterComponent;
