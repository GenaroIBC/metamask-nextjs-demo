import { CHAIN_IDs } from "../constants";

type Props = {
  chainID: string;
  isHexadecimal?: boolean;
};

export function getNetworkName({ chainID, isHexadecimal = false }: Props) {
  const networkName = isHexadecimal
    ? // @ts-ignore
      CHAIN_IDs[parseInt(chainID / Math.pow(10, 18))]
    : // @ts-ignore
      CHAIN_IDs[chainID];

  return networkName ?? "Unknown chain";
}
