import { Schema } from "mongoose";

const variantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    variantTypeId: {
      type: Schema.Types.ObjectId,
      ref: "VariantType",
      required: true,
    },
  },
  { timestamps: true }
);

export const Variant = mongoose.model("Variant", variantSchema);
