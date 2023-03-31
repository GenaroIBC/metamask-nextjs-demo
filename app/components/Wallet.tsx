import { Account } from "../types";
import { NetworkIcon } from "./NetworkIcon";
import { useEffect, useState } from "react";
import { ArrowIcon, BalanceIcon } from "./shared/Icons";

type Props = {
  account: Account;
};

const toggleWalletButtonID = "toggle-wallet-button";

export function Wallet({ account }: Props) {
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const trimmedAddress =
    account.address.slice(0, 7) +
    "..." +
    account.address.slice(account.address.length - 5);

  useEffect(() => {
    const handleCloseWallet = (e: MouseEvent) => {
      const eventTarget = e.target as HTMLElement;

      if (
        !eventTarget.matches(`#${toggleWalletButtonID} *`) &&
        !eventTarget.matches(`#${toggleWalletButtonID}`)
      ) {
        setIsWalletOpen(false);
      }
    };

    document.addEventListener("click", handleCloseWallet);

    return () => {
      document.removeEventListener("click", handleCloseWallet);
    };
  }, []);

  return (
    <section id={toggleWalletButtonID} className="relative">
      <button
        onClick={() => setIsWalletOpen((currentStatus) => !currentStatus)}
        className="font-medium flex items-center justify-center gap-2 cursor-pointer transition-all bg-slate-600/20 hover:bg-slate-600/30 active:bg-slate-600/50 px-4 rounded-xl text-base"
        type="button"
      >
        <BalanceIcon />
        <span>{trimmedAddress}</span>
        <div
          className="transition-transform"
          style={{
            transform: isWalletOpen ? "rotate(-180deg)" : "",
          }}
        >
          <ArrowIcon />
        </div>
      </button>
      <div
        className="absolute top-full right-0 transition-transform duration-500 shadow-2xl"
        style={{
          animation: isWalletOpen
            ? "fadeIn 0.5s linear both"
            : "fadeOut 0.3s linear both",
          transform: `${isWalletOpen ? "translateY(1rem)" : "translateY(0)"}`,
        }}
      >
        <article className="bg-slate-900 rounded-xl text-center flex flex-col shadow-2xl">
          <div className="flex gap-2 items-center text-white/80 bg-black/30 p-4">
            <div className="aspect-square">
              <BalanceIcon />
            </div>
            <p className="font-medium">{trimmedAddress}</p>
          </div>
          <span className="text-3xl font-medium p-4">
            {account.balance} ETH
          </span>

          <div className="p-4">
            <span className="text-xl font-medium flex gap-2 items-center opacity-80 bg-black/30 w-full rounded-lg p-4">
              <span className="w-4 inline-block">
                <NetworkIcon />
              </span>
              <span className="text-sm">{account.networkName}</span>
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}
