import { Account } from "../types";
import { NetworkIcon } from "./NetworkIcon";

type Props = {
  account: Account;
};

export function Wallet({ account }: Props) {
  return (
    <article className="bg-blue-900 rounded text-center flex flex-col border-blue-900 border-2 border-solid shadow-2xl">
      <p className="text-white/80 bg-black/30 w-full p-4 font-medium">
        {account.address.slice(0, 7) +
          "..." +
          account.address.slice(account.address.length - 5)}
      </p>
      <span className="text-3xl font-medium p-4">{account.balance} ETH</span>

      <span className="text-xl font-medium p-4 flex gap-2 items-center">
        <span className="w-4 inline-block">
          <NetworkIcon />
        </span>
        <span>{account.networkName}</span>
      </span>
    </article>
  );
}
