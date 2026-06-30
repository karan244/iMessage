//const express = require("express"); this is a better way
import express from "express"
import "dotenv/config";
const app = express();

//console.log("DB_URL =", process.env.DB_URL)
const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server is up and running on port:", PORT));