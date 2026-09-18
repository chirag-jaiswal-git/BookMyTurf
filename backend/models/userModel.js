import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
  },
  {
    timestamps: true,
  },
);

// Passport Local Mongoose
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose, {
  usernameField: "email",
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
