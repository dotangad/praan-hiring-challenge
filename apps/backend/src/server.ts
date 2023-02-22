import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { login, protectedRoute, register } from "./controllers/AuthController";
import { bulkUpload } from "./controllers/BulkUploadController";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const port = process.env.BACKEND_PORT;

import "./lib/passport";

// ----------------------------------------
// START Middleware
// ----------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ----------------------------------------
// END Middleware
// ----------------------------------------

// ----------------------------------------
// START Routes
// ----------------------------------------

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Authentication routes
app.post("/api/auth/register", ...register);
app.post("/api/auth/login", ...login);
app.post("/api/auth/protected", ...protectedRoute);

// Bulk upload from Excel sheet
app.post("/api/bulk_upload", ...bulkUpload);

// Query data points
// app.post("/api/data/query"); // body -> { devices: string[], startDate: DateTime, endDate: DateTime, metrics: string[] }
// app.post("/api/data/device/:deviceId"); // body -> { metrics: [] }

// ----------------------------------------
// END Routes
// ----------------------------------------

// ----------------------------------------
// START Error handler
// ----------------------------------------

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : null,
  });
});

// ----------------------------------------
// END Error handler
// ----------------------------------------

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
