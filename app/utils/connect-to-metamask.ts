export async function connectToMetamask(): Promise<
  { ok: false; error: string } | { ok: true; data: string }
> {
  try {
    // @ts-ignore
    if (!window.ethereum)
      return { ok: false, error: "Metamask not installed!" };

    // @ts-ignore
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts?.length) return { ok: false, error: "No account detected" };

    return { ok: true, data: accounts[0] };
  } catch (error) {
    // @ts-ignore
    if (error?.code === 4001) {
      return { ok: false, error: "Please allow access to this site" };
    }
    return { ok: false, error: "there was an error connecting to MetaMask" };
  }
}
