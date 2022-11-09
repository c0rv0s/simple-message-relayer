import { BigNumber } from "ethers";
import { gnosisProvider } from "./utils";
import axios from "axios";

/**
 *
 * @returns gas price on gnosis
 */
export const gasPriceGnosis = async (): Promise<BigNumber> => {
  const feeData = await gnosisProvider.getFeeData();
  return feeData.gasPrice!;
};

/**
 * calculates eth required to pay for gnosis "increment" tx
 * @param gasPrice gas price on gnosis
 * @param ethPrice eth price in usd
 * @returns eth required to pay for gnosis tx
 */
export const gnosisTxCost = (
  gasPrice: BigNumber,
  ethPrice: number
): BigNumber => {
  const gasNeeded = 28056; // cost of an increment call made through AMB
  const totalWei = BigNumber.from(gasNeeded).mul(gasPrice);

  // convert from XDAI -> ETH
  return totalWei.div(BigNumber.from(Math.floor(ethPrice)));
};

/**
 *
 * @returns current eth price in usd
 */
export const getEthPrice = async () => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  return data.ethereum.usd;
};
