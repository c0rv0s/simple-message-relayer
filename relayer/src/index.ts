import express from "express";
import { listen } from "./listen";
import { goerliProvider } from "./utils";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

const loop = (blockNumber: number) => {
  setTimeout(() => {
    listen(blockNumber);
    loop(blockNumber + 1);
  }, 13000);
};

// start the Express server
app.listen(PORT, () => {
  try {
    // get current block number on gorli and loop relayer process
    goerliProvider.getBlockNumber().then((blockNumber) => loop(blockNumber));
  } catch (error) {
    // tslint:disable:no-console
    console.log("Error has occured: ", error);
  }
});
