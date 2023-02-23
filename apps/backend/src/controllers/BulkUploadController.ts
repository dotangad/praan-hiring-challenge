import multer from "multer";
import fs from "fs";
import _ from "lodash";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { parseCSVFromFilename } from "../lib/csv";
import { prisma } from "../lib/db";
import { DataPoint } from "@prisma/client";

const upload = multer({
  storage: multer.diskStorage({
    destination: "mnt_uploads/bulk_upload",
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  }),
});

export const bulkUpload = [
  passport.authenticate("jwt", { session: false }),
  upload.array("raw_data"),
  async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    const file = (req.files as Express.Multer.File[])[0];

    // Validate mime type
    if (file.mimetype !== "text/csv") {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid file type, please upload a CSV file",
      });
    }

    // Parse CSV
    const rows = (await parseCSVFromFilename(file.path)) as {
      [header: string]: string;
    }[];
    const headers = Object.keys(rows[0]);

    // Check if headers are valid
    // t -> timestamp
    // w -> windspeed
    // h -> wind_direction
    if (!_.isEqual(headers, ["device", "t", "w", "h", "pm1", "pm25", "pm10"])) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid headers, please check your CSV file",
      });
    }

    // Put data into database
    await prisma.dataPoint.createMany({
      data: rows
        .map((row) => {
          const { device, t, w, h, pm1, pm25, pm10 } = row;

          if (!device || !t || !w || !h || !pm1 || !pm25 || !pm10) return false;
          if (!["DeviceA", "DeviceB", "DeviceC"].includes(device)) return false;
          if (!["N", "S", "W", "E", "NE", "NW", "SE", "SW"].includes(h))
            return false;
          if (
            isNaN(Number(w)) ||
            isNaN(Number(pm1)) ||
            isNaN(Number(pm25)) ||
            isNaN(Number(pm10))
          )
            return false;

          const parseTimestamp = (date: string) => {
            // @ts-ignore
            const match = date.match(
              // This regex uses named capture groups to parse and extract parts of the date
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/named_capture_groups
              // I would reccommend putting it into regex101.com to see how it works before making any changes
              /^(?<year>2\d)\/(?<month>\d{2})\/(?<date>\d{2}),(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})$/
              // ^^ This is why programmers hate dealing with dates
            );

            return new Date(
              `20${match?.groups?.year}-${match?.groups?.month}-${match?.groups?.date}T${match?.groups?.hour}:${match?.groups?.minute}:${match?.groups?.second}`
            );
          };

          const timestamp = parseTimestamp(t);
          if (timestamp.toString() === "Invalid Date") return false;

          return {
            device,
            timestamp: parseTimestamp(t),
            windspeed: Number(w),
            wind_direction: h,
            pm1: Number(pm1),
            pm25: Number(pm25),
            pm10: Number(pm10),
          };
        })
        .filter((x) => !!x) as DataPoint[],
    });

    res.status(201).json({ success: true, message: "Data added" });
  },
];
