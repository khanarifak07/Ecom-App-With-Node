import { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    minimumPurchaseAmount: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    applicableCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    applicableSubCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    applicableProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
