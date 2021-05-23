const dotenv = require("dotenv");
dotenv.config({
  path: "src/config.env",
});
const express = require("express");
const cors = require("cors");
const notify = require("./services/lineNotify");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.post("/notify", async (req, res) => {
  let message = req.body.message;
  console.log("message=>", message);
  await notify.sendNotification(message);
  res.status(200).json({
    message: "ok",
  });
});

app.listen(port, async () => {
  console.log(`server connecting on port ${port}`);
});
