import { Schema } from "mongoose";

const posterSchema = new Schema(
  {
    posterName: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Poster = mongoose.model("Poster", posterSchema);
