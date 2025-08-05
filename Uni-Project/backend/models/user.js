import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});
const User = mongoose.model("user", userSchema);

export default User;
