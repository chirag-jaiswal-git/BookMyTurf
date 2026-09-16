import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import userModel from "../models/userModel.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async (email, password, done) => {
      try {
        const user = await userModel.findOne({
          email: email.toLowerCase().trim(),
        });

        if (!user) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Please create a new account",
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
