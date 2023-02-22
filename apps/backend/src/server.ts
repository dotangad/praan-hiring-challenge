import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { login, protectedRoute, register } from "./controllers/AuthController";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const port = process.env.BACKEND_PORT;

import "./lib/passport";

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/auth/register", ...register);
app.post("/api/auth/login", ...login);
app.post("/api/auth/protected", ...protectedRoute);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
