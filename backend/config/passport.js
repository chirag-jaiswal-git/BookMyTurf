import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import userModel from "../models/userModel.js";

// ===============================
// LOCAL STRATEGY
// ===============================

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    userModel.authenticate(),
  ),
);

// ===============================
// SAVE USER IN SESSION
// ===============================

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ===============================
// GET USER FROM SESSION
// ===============================

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
