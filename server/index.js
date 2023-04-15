const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

// 02f6b6cfa6d4f94d3f05d6ce31d0cedca697c55730909e6074c8d9fdbe25402424
// 02d05f04eeead5f8bad98236887c7a457bd3f4a29af0659d3c119fb5aaf5e66104
// 038aaf7c7c57a5e7da15e5c08120db074dbe3cf186cb47abb27c3724989f112d12

const balances = {
  "0xd0cedca697c55730909e6074c8d9fdbe25402424": 100,
  "0x7c7a457bd3f4a29af0659d3c119fb5aaf5e66104": 50,
  "0x20db074dbe3cf186cb47abb27c3724989f112d12": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, hashedMessage, signature, publicKey } = req.body;
  const { recipient, sender, amount } = message;

  const hashedMessage1 = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));

  const sameMessage = hashedMessage === hashedMessage1;

  if (!sameMessage) return res.status(508).json({ msg: "Invalid Inputs" });

  const sameSender = publicKey === sender;

  if (!sameSender)
    return res.status(509).json({ msg: "Incorrect tsx.sender || signer" });

  const isSigned = secp256k1.verify(signature, hashedMessage, publicKey);

  if (!isSigned) return res.status(510).json({ msg: "Invalid sign" });

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances["0x" + sender.slice(-40)] < amount) {
    res.status(405).json({ msg: "Not enough funds!" });
  } else {
    balances["0x" + sender.slice(-40)] -= amount;
    balances["0x" + recipient.slice(-40)] += amount;
    res.send({ balance: balances["0x" + sender.slice(-40)] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
