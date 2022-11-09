import { providers, Contract, Wallet } from "ethers";
const config = require("../config.json");

const AMB_ADDRESS = "0x74C4F8676D88db8929b2250bD74B53a045fA26D5";

const ABI = [
  "function send(uint256 value, address target, bytes calldata data) external payable",
  "function receiveMsg(uint256 value, address target, bytes calldata data) external returns (bytes memory)",
  "event Send(uint256 gas, uint256 value, address target, bytes data)",
  "event Receive(uint256 value, address target, bytes data)",
];

const test = config.TEST;
const testRpc = "http://127.0.0.1:8545";

export const goerliProvider = new providers.JsonRpcProvider(
  test ? testRpc : "https://rpc.ankr.com/eth_goerli"
);
export const gnosisProvider = new providers.JsonRpcProvider(
  test ? testRpc : "https://rpc.gnosischain.com/"
);

export const listenContract = new Contract(AMB_ADDRESS, ABI, goerliProvider);
export const postContract = new Contract(AMB_ADDRESS, ABI, gnosisProvider);
export const wallet = new Wallet(
  test ? config.TEST_ADMIN_PK : config.ADMIN_PK,
  gnosisProvider
);
