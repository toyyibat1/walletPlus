import mongoose from "mongoose";

const pointSchema = mongoose.Schema({
  userId: { type: String, required: true },
  balance: { type: Number, required: true },
});

const Point = mongoose.model("Point", pointSchema);

export default Point;
