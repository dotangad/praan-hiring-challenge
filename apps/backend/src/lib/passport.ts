import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { prisma } from "./db";

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.create({
          data: {
            email,
            password: await bcrypt.hash(password, 10),
          },
        });

        return done(null, user);
      } catch (error) {
        if ((error as Error).message.includes("Unique constraint ")) {
          done({ status: 400, message: "Email already in use" });
        }

        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done({ status: 401, message: "User not found" }, false);
        }

        const validate = await bcrypt.compare(password, user.password);

        if (!validate) {
          return done({ status: 401, message: "Invalid credentials" }, false);
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
