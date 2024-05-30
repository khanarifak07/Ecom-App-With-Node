import mongoose, { Schema } from "mongoose";

const subCategoryScheme = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requireda"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category Id is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

export const SubCategory = mongoose.model("SubCategory", subCategoryScheme);
