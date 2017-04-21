const express = require("express");
const winston = require("winston");
const bodyParser = require("body-parser")
const app = express();

const PORT = process.env.PORT || 8080;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";

const phonecontacts = require("./routes/phonecontacts")

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use("/routes/phonecontacts", phonecontacts)

app.listen(PORT, () => {
  winston.info(`App listening on ${SERVER_URL}:${PORT}`);
});


module.exports = app;