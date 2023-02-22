import fs from "fs";
import csv from "csv-parser";

/**
 * Parse a CSV file given it's filepath
 *
 * This function uses the `csv-parser` library and `fs` read streams.
 *
 * @param filepath string
 * @returns `Promise<{ [header: string]: string }[]>` - Rows as an array of objects
 */
export const parseCSVFromFilename = (filepath: string) => {
  return new Promise((resolve, reject) => {
    const rows: { [header: string]: string }[] = [];
    fs.createReadStream(filepath, { encoding: "utf-8" })
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
};
