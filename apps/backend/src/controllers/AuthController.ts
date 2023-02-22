import passport from "passport";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const register = [
  passport.authenticate("signup", { session: false }),
  async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Signup successful",
      user: req.user,
    });
  },
];

export const login = [
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("login", async (err: any, user?: any) => {
      try {
        if (err || !user) {
          const error = new Error("An error occurred.");

          return next(error);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.JWT_SECRET ?? "");

          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  },
];

export const protectedRoute = [
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "You are successfully authenticated to this route!",
      user: req.user,
    });
  },
];
