import mongoose from "mongoose";
import orderPageModel from "./orderPageModel.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [[orderPageModel.schema]],
});

export default mongoose.model("User", userSchema);
