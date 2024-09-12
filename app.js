const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes");
const path = require('path');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => console.log(`Listening to port ${port}`));
