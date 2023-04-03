const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./src/config/database");
const user_route = require("./src/routes/user.route");
const church_route = require("./src/routes/church.route");
const income_route = require("./src/routes/income.route");
const payment_route = require("./src/routes/payments.route");
const recovery_route = require("./src/routes/recovery.route");
const transaction_route = require("./src/routes/transaction.route");
const redirect_route = require("./src/routes/redirect.route");
const webhook_route = require("./src/routes/webhook.route");
const Errormiddleware = require("./src/middlewares/errormiddleware")

const app = express();
connectDatabase(app);
app.use(cors());
app.use(express.json());

app.use(
  "/api/v1/users",
  user_route,
  church_route,
  income_route,
  payment_route,
  recovery_route,
  transaction_route
);
app.use("/api/v1/redirect",redirect_route);
app.use("api/v1/webhooks", webhook_route);
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to the api for the tithe box app" });
});

app.all("*", (req, res) => {
  res.send({
    status: false,
    messsage: "Oops! you've hit an invalid route.",
  });
});

app.use(Errormiddleware);