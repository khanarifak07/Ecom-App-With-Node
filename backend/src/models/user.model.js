import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (value) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return value.match(re);
        },
        message: "Please enter a valid email",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (value) => {
          return value.length >= 6;
        },
        message: "Password should contain atleast 6 characters",
      },
    },

    avatar: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

//password hasing using per hooks and bcrypt (save)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
