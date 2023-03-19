type Params = {
  address: string;
};

export async function getBalance({
  address,
}: Params): Promise<{ ok: false; error: string } | { ok: true; data: number }> {
  try {
    if (!address) {
      return { ok: false, error: "Invalid Address, please try again" };
    }

    // @ts-ignore
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address],
    });

    const convertedBalance = parseInt(balance) / Math.pow(10, 18);

    return { ok: true, data: convertedBalance };
  } catch (error) {
    return { ok: false, error: "error retrieving balance" };
  }
}
