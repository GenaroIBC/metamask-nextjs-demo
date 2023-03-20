type Props = {
  handleConnect: () => void;
};

export function ConnectWallet({ handleConnect }: Props) {
  return (
    <section>
      <button
        className="bg-blue-700 hover:bg-blue-600 transition-colors"
        onClick={handleConnect}
      >
        Connect Metamask
      </button>
    </section>
  );
}
