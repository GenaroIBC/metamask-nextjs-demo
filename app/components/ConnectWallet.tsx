type Props = {
  handleConnect: () => void;
};

export function ConnectWallet({ handleConnect }: Props) {
  return (
    <section>
      <p>Connect to metamask to see your account data</p>
      <button className="bg-violet-500 py-2 px-4" onClick={handleConnect}>
        Connect to Metamask
      </button>
    </section>
  );
}
