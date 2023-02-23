import z from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      next();
    } catch (err) {
      res.status(400).json({
        success: false,
        zod: {
          errors: (err as Zod.ZodError).errors,
          formErrors: (err as Zod.ZodError).formErrors,
        },
      });
    }
  };

export const metricsSchema = z
  .union([
    z.literal("windspeed"),
    z.literal("wind_direction"),
    z.literal("pm1"),
    z.literal("pm10"),
    z.literal("pm25"),
  ])
  .array()
  .nonempty();

export const devicesSchema = z
  .union([z.literal("DeviceA"), z.literal("DeviceB"), z.literal("DeviceC")])
  .array()
  .nonempty();
