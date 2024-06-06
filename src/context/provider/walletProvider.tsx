import React, { useState, ReactNode } from 'react';
import WalletContext, { WalletContextType } from '../walletContext';

interface WalletProviderProps {
  children: ReactNode;
}

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletLogin, setWalletLogin] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string>('');

  const value: WalletContextType = {
    walletLogin,
    publicKey,
    setWalletLogin,
    setPublicKey
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
