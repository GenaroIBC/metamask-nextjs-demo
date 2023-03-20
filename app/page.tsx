"use client";

import { useEffect, useState } from "react";
import { ConnectWallet } from "./components/ConnectWallet";
import { Wallet } from "./components/Wallet";
import { Account } from "./types";
import { connectToMetamask } from "./utils/connect-to-metamask";
import { getBalance } from "./utils/get-address-balance";
import { getNetworkName } from "./utils/get-network-name";

function Home() {
  const [account, setAccount] = useState<Account | null>(null);
  const [isRetrievingSession, setRetrievingSession] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const handleRetrieveSession = async () => {
    const result = await connectToMetamask();

    if (!result.ok) return setError(result.error);
    const address = result.data;
    const balanceResult = await getBalance({ address });
    if (!balanceResult.ok) return setError(balanceResult.error);

    setAccount(() => {
      return {
        address,
        balance: balanceResult.data,
        networkName: getNetworkName({
          // @ts-ignore
          chainID: window.ethereum.networkVersion,
        }),
      };
    });
    setError(null);
  };

  useEffect(() => {
    setRetrievingSession(true);
    const hasConnected = JSON.parse(
      localStorage.getItem("hasConnectedToMetaMask") ?? "false"
    );

    if (!hasConnected) return setRetrievingSession(false);

    handleRetrieveSession().finally(() => setRetrievingSession(false));
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
          networkName: getNetworkName({
            // @ts-ignore
            chainID: window.ethereum.networkVersion,
          }),
        };
      });
      setError(null);
    };

    const handleChainChanged = async (newHexChain: string) => {
      setAccount((currentAccount) => {
        if (!currentAccount) return currentAccount;

        return {
          ...currentAccount,
          networkName: getNetworkName({
            chainID: newHexChain,
            isHexadecimal: true,
          }),
        };
      });
      if (!account) return;

      const balanceResult = await getBalance({ address: account.address });
      if (!balanceResult.ok) return setError(balanceResult.error);

      setAccount(() => {
        return {
          address: account.address,
          balance: balanceResult.data,
          networkName: getNetworkName({
            chainID: newHexChain,
            isHexadecimal: true,
          }),
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
    <main className="flex flex-col gap-12 justify-center items-center w-screen h-screen p-4">
      <h1 className="text-2xl font-bold">Metamask Integration Demo</h1>

      <div className="flex flex-col gap-4 justify-center items-center rounded">
        {isRetrievingSession ? (
          <div className="relative">
            <div className="absolute backdrop-blur-[2px] grid place-content-center font-bold top-0 left-0 right-0 bottom-0"></div>
            <div className="opacity">
              <Wallet
                account={{
                  address: "0x1000101100100100101100",
                  balance: 0,
                  networkName: "Mainnet",
                }}
              />
            </div>
          </div>
        ) : account ? (
          <Wallet account={account} />
        ) : (
          <ConnectWallet handleConnect={handleRetrieveSession} />
        )}
      </div>

      {error && <p className="text-red-500 p-4">{error}</p>}
    </main>
  );
}

export default Home;
