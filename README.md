# Succinct Labs Take Home

https://hackmd.io/@succinctlabs/By1AQdDBo

## Solution

Relayer scans AMB contract events for a new `Send` event, tracking already scanned block numbers in memory as it goes. When a new event is picked up it checks how much eth was paid in the call for gas. If the amount paid is enough to cover the gas cost on the receiving chain then it will mirror the tx.

The responsibility of knowing how much gas to pay for is put on the user at the time of tx. Since this relayer will be getting very little usage it does not make sense to be writing gas data to the contract for on-chain verification via an oracle. Instead the contract verifies the gas payment made and then the relayer is expected to determine if that payment covers its costs and relay the tx if yes.

## Deployments:

Both contracts have been deployed to the same address on Görli and Gnosis Chain

AMB: 0x74C4F8676D88db8929b2250bD74B53a045fA26D5

Counter: 0xb83D12206fA955398b9260757133326FF66A5F8A

## Live Tests

The relayer was tested twice to cover the two main cases

1. Message was sent but insufficient gas was supplied:

- Görli tx: [0x19272991288a98d2c3f82ddacf59cbb632cc54af628852799ec0abde32c992ac](https://goerli.etherscan.io/tx/0x19272991288a98d2c3f82ddacf59cbb632cc54af628852799ec0abde32c992ac).

- Relayer logged: `Tx not broadcasted, gas needed: 36248062184, gas supplied: 0`

- No tx was mirrored on Gnosis.

2. Message was sent and gas was supplied:

- Görli tx: [0xa7ada3f6bd6e6481257182765d8a44c63ee254696b08a85968d0cd8d27050b31](https://goerli.etherscan.io/tx/0xa7ada3f6bd6e6481257182765d8a44c63ee254696b08a85968d0cd8d27050b31).

- Gnosis tx mirrored by relayer: [0xaf6ca881a3ef047fb22757d9d8d3ead35ec9f0b636037ffa641c2fc593f3319a](https://gnosisscan.io/tx/0xaf6ca881a3ef047fb22757d9d8d3ead35ec9f0b636037ffa641c2fc593f3319a)

## Further Development

There are a few glaring holes with this design that would need to be accounted for before a production release.

1. This would most likely be used from a web UI. The UI would need to supply the user with realtime value for the gas required to relay.
2. If insufficient gas payment is supplied the relayer should still keep the tx in a queue and send it when gas costs are back in range (assuming tx does not revert). This would probably require a deadline to be set for how long it will remain in the queue
3. If the gas supplied by the user is greater than what is used on the mirror chain a refund system should be implemented.
4. I forgot to add a gas payment withdraw function before deploying these contracts. I added the function to the source code after but the above deployments will have all gas payments trapped in the contract.
5. Currently the relayer operator is expected to take the necessary measures to ensure that their relayer account is properly funded across all chains. A more advanced relayer would track balances and perform any bridge/swap txs needed automatically.
6. If a user wants to send a message with a high value the relayer may not be able to fulfill the request on the opposite chain. A warning and a refund system would be a good way to handle this.
7. The same message value included on the Görli chain is mirrored across to Gnosis. This actually means the user is severely overpaying for execution. The AMB contract should account for price conversions between native tokens.
8. By default the relayer starts from the current block number and every 13 seconds increases by one. The relayer should log the last scanned block so if there's down time it can pick up where it left off.
9. Görli blocks should always be 13 seconds but over time millisecond drift could result in blocks getting missed or double scanned. A more sophisticated tx tracking mechanism could ensure every block is scanned and every tx only mirrored once.
