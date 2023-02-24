import express, { ErrorRequestHandler } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import * as AuthController from "./controllers/AuthController";
import * as BulkUploadController from "./controllers/BulkUploadController";
import * as DataController from "./controllers/DataController";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const port = process.env.PORT;

import "./lib/passport";

// ----------------------------------------
// START Middleware
// ----------------------------------------

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ----------------------------------------
// END Middleware
// ----------------------------------------

// ----------------------------------------
// START Routes
// ----------------------------------------

app.get("/", (_, res) =>
  res.status(418).json({ success: true, message: "I'm a teapot" })
);

// Authentication routes
app.post("/api/auth/register", ...AuthController.register);
app.post("/api/auth/login", ...AuthController.login);
app.get("/api/auth/me", ...AuthController.me);

// Bulk upload from Excel sheet
app.post("/api/bulk_upload", ...BulkUploadController.bulkUpload);

// Query data points
app.post("/api/data/query", ...DataController.query);
app.post("/api/data/device/:device", ...DataController.device);

// ----------------------------------------
// END Routes
// ----------------------------------------

// ----------------------------------------
// START Error handler
// ----------------------------------------

app.all("*", (_, res) =>
  res.status(404).json({ success: false, message: "Not found" })
);

app.use(((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  } else {
    // report error
  }

  // Set statusCode to 500 if it isn't already there
  err.statusCode = err.statusCode || 500;
  err.message = err.message || err.name || "Internal Server Error";

  return res
    .status(err.statusCode)
    .json({ success: false, message: err.message });
}) as ErrorRequestHandler);

// ----------------------------------------
// END Error handler
// ----------------------------------------

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
