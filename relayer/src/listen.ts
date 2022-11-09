import { listenContract, postContract, wallet } from "./utils";
import { gasPriceGnosis, getEthPrice, gnosisTxCost } from "./prices";

/**
 * scans gorli AMB contract for events and mirrors on gnosis if paid for
 * @param blockNumber block number to scan from on gorli
 */
export const listen = async (blockNumber: number) => {
  console.log("scanning from block", blockNumber);

  try {
    // query for post event
    const msgs = await listenContract.queryFilter(
      listenContract.filters.Send(),
      blockNumber
    );

    // get current gas price
    const gasPriceOnGnosis = await gasPriceGnosis();
    const ethPrice = await getEthPrice();

    // process messages
    msgs.forEach(async (msg) => {
      // calculate tx cost
      const txCost = gnosisTxCost(gasPriceOnGnosis, ethPrice);

      // send the ones that are paid for
      if (txCost.lte(msg.args![0])) {
        console.log("sending tx");
        postContract
          .connect(wallet)
          .receiveMsg(msg.args![1], msg.args![2], msg.args![3]);
      } else {
        console.log(
          `Tx not broadcasted, gas needed: ${txCost.toString()}, gas supplied: ${msg.args![0].toString()}`
        );
      }
    });
  } catch (error) {
    console.log("error:", error);
  }
};
