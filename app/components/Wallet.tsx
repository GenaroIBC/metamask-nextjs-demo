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
        className="absolute top-full left-1/2 transition-transform duration-500"
        style={{
          animation: isWalletOpen
            ? "fadeIn 0.5s linear both"
            : "fadeOut 0.3s linear both",
          transform: `translateX(-50%) ${
            isWalletOpen ? "translateY(1rem)" : "translateY(0)"
          }`,
        }}
      >
        <article className="bg-blue-900 rounded text-center flex flex-col border-blue-900 border-2 border-solid shadow-2xl sm:min-w-[300px]">
          <p className="text-white/80 bg-black/30 w-full p-4 font-medium">
            {trimmedAddress}
          </p>
          <span className="text-3xl font-medium p-4">
            {account.balance} ETH
          </span>

          <span className="text-xl font-medium p-4 flex gap-2 items-center opacity-80">
            <span className="w-4 inline-block">
              <NetworkIcon />
            </span>
            <span className="text-sm">{account.networkName}</span>
          </span>
        </article>
      </div>
    </section>
  );
}
