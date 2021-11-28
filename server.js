import express from "express";
import points from "./routes/points.js";

const fetchrewardsAPI = express();
const PORT = 3001;

fetchrewardsAPI.use(express.json());

fetchrewardsAPI.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});

fetchrewardsAPI.get("/", (req, res) => {
  console.log("Welcome to the fetchrewardsAPI");
  res.send("Welcome to the fetchrewardsAPI");
});

fetchrewardsAPI.use("/points", points);
