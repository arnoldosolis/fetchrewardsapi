const express = require("express");
const fetchrewardsAPI = express();
const PORT = 3001;

fetchrewardsAPI.use(express.json());

fetchrewardsAPI.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});

// Will add a transaction for a specific payer and date
fetchrewardsAPI.post("/add/:id", (req, res) => {
  const { id } = req.params;
  const { payer } = req.body;
  const { points } = req.body;
  const { timestamp } = req.body;
  if (!payer || !points || !timestamp) {
    res.status(418).send({ message: "Missing input field" });
  }

  res.send({
    payer: `${payer}`,
    points: `${points}`,
    timestamp: `${timestamp}`,
  });
});

fetchrewardsAPI.put("/spendPoints");

fetchrewardsAPI.get("/allPayerPoint", (req, res) => {
  res.status(200).send({
    tshirt: "large",
  });
});
