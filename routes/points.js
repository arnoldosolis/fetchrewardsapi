import express from "express";
const router = express.Router();

// This is what is initally loaded onto memory for transactions
let example = [
  {
    payer: "DANNON",
    points: 1000,
    timestamp: "2020-11-02T14:00:00Z",
  },
  {
    payer: "UNILEVER",
    points: 200,
    timestamp: "2020-10-31T11:00:00Z",
  },
  { payer: "DANNON", points: -200, timestamp: "2020-10-31T15:00:00Z" },
  {
    payer: "MILLER COORS",
    points: 10000,
    timestamp: "2020-11-01T14:00:00Z",
  },
  { payer: "DANNON", points: 300, timestamp: "2020-10-31T10:00:00Z" },
];

// Return all payer point balances
router.get("/", (req, res) => {
  const payerBalance = new Map();
  example.forEach((element) => {
    if (payerBalance.get(element.payer) === undefined) {
      payerBalance.set(element.payer, element.points);
    } else {
      let prevPoints = payerBalance.get(element.payer);
      payerBalance.delete(element.payer);
      payerBalance.set(element.payer, prevPoints + element.points);
    }
  });
  // converts map to json
  const obj = Object.fromEntries(payerBalance);
  res.send(obj);
});

// Add transactions for a specific payer and date
router.post("/", (req, res) => {
  const payer = req.body.payer;
  if (!payer) {
    res.send("Cannot insert transaction without payer");
    return;
  }
  const points = req.body.points;
  if (!points) {
    res.send("Cannot insert transaction without points");
    return;
  }
  const timestamp = req.body.timestamp;
  if (!timestamp) {
    res.send("Cannot insert transaction without timestamp");
    return;
  }
  const transaction = req.body;
  // This will store any transactions temporarily
  example.push(transaction);

  res.send(transaction);
});

// Returns key with lowest value
function lowestValue(obj) {
  var [lowestItems] = Object.entries(obj).sort(([, v1], [, v2]) => v1 - v2);
  return lowestItems[0];
}

// Spend points
// Rules:
// 1. Oldest points must be spent first (based on transaction timestamp)
// 2. No payer's points should go to negative
router.patch("/", (req, res) => {
  var points = req.body;

  const payerBalance = new Map();
  example.forEach((element) => {
    if (payerBalance.get(element.payer) === undefined) {
      payerBalance.set(element.payer, element.points);
    } else {
      let prevPoints = payerBalance.get(element.payer);
      payerBalance.delete(element.payer);
      payerBalance.set(element.payer, prevPoints + element.points);
    }
  });

  const payerTimestamp = new Map();
  example.forEach((element) => {
    if (payerTimestamp.get(element.payer) === undefined) {
      payerTimestamp.set(element.payer, element.timestamp);
    } else {
      var d1 = new Date(payerTimestamp.get(element.payer));
      var d2 = new Date(element.timestamp);
      if (d1 > d2) {
        payerTimestamp.delete(element.payer);
        payerTimestamp.set(element.payer, element.timestamp);
      }
    }
  });
  while (points !== 0 || payerBalance.size() !== 0) {
    let oldestPoints = lowestValue(payerTimestamp);
    if (points > payerBalance.get(oldestPoints)) {
      payerBalance.delete();
    }
  }
  // converts map to json
  const obj = Object.fromEntries(payerBalance);
  res.send(obj);
});

export default router;
