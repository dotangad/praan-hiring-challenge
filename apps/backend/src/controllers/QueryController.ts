import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/db";

export const device = [
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    if (!req.body.metrics || !Array.isArray(req.body.metrics))
      return res.status(400).json({ success: false });

    res.status(200).json({
      success: true,
      data: await prisma.dataPoint.findMany({
        where: { device: req.params.device },
        select: {
          timestamp: true,
          windspeed: req.body.metrics.includes("w"),
          wind_direction: req.body.metrics.includes("h"),
          pm1: req.body.metrics.includes("pm1"),
          pm10: req.body.metrics.includes("pm10"),
          pm25: req.body.metrics.includes("pm25"),
        },
      }),
    });
  },
];
