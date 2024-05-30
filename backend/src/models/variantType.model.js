import { Schema } from "mongoose";

// Define the Variant schema
const variantTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Create the Variant model
export const VariantType = mongoose.model("VariantType", variantTypeSchema);
