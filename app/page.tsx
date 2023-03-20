"use client";

import { useEffect, useState } from "react";
import { ConnectWallet } from "./components/ConnectWallet";
import { Wallet } from "./components/Wallet";
import { CHAINS_ID } from "./constants";
import { Account } from "./types";
import { connectToMetamask } from "./utils/connect-to-metamask";
import { getBalance } from "./utils/get-address-balance";

function Home() {
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnectToMetamask = async () => {
    const result = await connectToMetamask();

    if (!result.ok) return setError(result.error);
    const address = result.data;
    const balanceResult = await getBalance({ address });
    if (!balanceResult.ok) return setError(balanceResult.error);
    // @ts-ignore
    setAccount(() => {
      return {
        address,
        balance: balanceResult.data,
        // @ts-ignore
        networkName: CHAINS_ID[ethereum.networkVersion] ?? "Unknown network",
      };
    });
    setError(null);
  };

  useEffect(() => {
    handleConnectToMetamask();
  }, []);

  useEffect(() => {
    const handleAccountsChanged = async ([newAddress]: string[]) => {
      if (!newAddress) return;
      const balanceResult = await getBalance({ address: newAddress });
      if (!balanceResult.ok) return setError(balanceResult.error);

      setAccount(() => {
        return {
          address: newAddress,
          balance: balanceResult.data,
          networkName:
            // @ts-ignore
            CHAINS_ID[window.ethereum.networkVersion] ?? "Unknown network",
        };
      });
      setError(null);
    };

    const handleChainChanged = async (newHexChain: string) => {
      setAccount((currentAccount) => {
        if (!currentAccount) return currentAccount;

        return {
          ...currentAccount,
          networkName:
            // @ts-ignore
            CHAINS_ID[parseInt(newHexChain / Math.pow(10, 18))] ??
            "Unknown chain",
        };
      });
      if (!account) return;

      const balanceResult = await getBalance({ address: account.address });
      if (!balanceResult.ok) return setError(balanceResult.error);

      setAccount(() => {
        return {
          address: account.address,
          balance: balanceResult.data,
          networkName:
            // @ts-ignore
            CHAINS_ID[window.ethereum.networkVersion] ?? "Unknown network",
        };
      });
      setError(null);
    };

    // @ts-ignore
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // @ts-ignore
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      // @ts-ignore
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      // @ts-ignore
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account]);

  return (
    <main className="flex flex-col gap-12 justify-center items-center w-screen h-screen">
      <h1 className="text-2xl font-bold ">Metamask Integration Demo</h1>

      <div className="flex flex-col gap-4 justify-center items-center rounded">
        {account ? (
          <Wallet account={account} />
        ) : (
          <ConnectWallet handleConnect={handleConnectToMetamask} />
        )}
      </div>

      {error && <p className="text-red-500 p-4">{error}</p>}
    </main>
  );
}

export default Home;
