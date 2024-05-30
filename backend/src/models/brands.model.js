import { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory ",
      required: [true, "SubCategory Id is required"],
    },
  },
  { timestamps: true, versionKey: false }
);
