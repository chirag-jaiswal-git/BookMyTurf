import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import userModel from "../models/userModel.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    userModel.authenticate(),
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user._id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user ID:", id);

    const user = await userModel.findById(id);

    if (!user) {
      console.log("User not found during deserialization");
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    console.error("Deserialization error:", error);
    done(error, null);
  }
});

export default passport;
