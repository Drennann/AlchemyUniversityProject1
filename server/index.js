const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

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
  const { message, hashedMessage, signature } = req.body;
  const { recipient, sender, amount } = message;

  const hashedMessage1 = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));

  const sameMessage = hashedMessage === hashedMessage1;

  if (!sameMessage) return res.send("Invalid Inputs");

  console.log(secp);
  /* const correctSender = signature.recoverPublicKey(hashedMessage).toHex(); */

  /* console.log("correctSender:", correctSender); */

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
