import passport from "passport";
import { NextFunction, Request, Response } from "express";
import z from "zod";
import { devicesSchema, metricsSchema, validateBody } from "../lib/validation";
import { prisma } from "../lib/db";

export const device = [
  passport.authenticate("jwt", { session: false }),
  validateBody(z.object({ metrics: metricsSchema })),
  async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: await prisma.dataPoint.findMany({
        where: { device: req.params.device },
        select: {
          timestamp: true,
          windspeed: req.body.metrics.includes("windspeed"),
          wind_direction: req.body.metrics.includes("wind_direction"),
          pm1: req.body.metrics.includes("pm1"),
          pm10: req.body.metrics.includes("pm10"),
          pm25: req.body.metrics.includes("pm25"),
        },
      }),
    });
  },
];

export const query = [
  passport.authenticate("jwt", { session: false }),
  validateBody(
    z.object({
      devices: devicesSchema,
      metrics: metricsSchema,
      after: z.string().datetime().optional(),
      before: z.string().datetime().optional(),
    })
  ),
  async (req: Request, res: Response) => {
    const { devices, after, before, metrics } = req.body;

    res.status(200).json({
      success: true,
      data: await prisma.dataPoint.findMany({
        where: {
          device: { in: devices },
          timestamp: {
            gte: after ? new Date(after) : undefined,
            lte: before ? new Date(before) : undefined,
          },
        },
        select: {
          timestamp: true,
          device: true,
          windspeed: metrics.includes("windspeed"),
          wind_direction: metrics.includes("wind_direction"),
          pm1: metrics.includes("pm1"),
          pm10: metrics.includes("pm10"),
          pm25: metrics.includes("pm25"),
        },
      }),
    });
  },
];
