import React from 'react';

export interface WalletContextType {
  walletLogin: boolean;
  publicKey: string;
  setWalletLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setPublicKey: React.Dispatch<React.SetStateAction<string>>;
}

const WalletContext = React.createContext<WalletContextType | undefined>(undefined);

export default WalletContext;
