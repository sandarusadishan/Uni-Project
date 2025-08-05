import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  gmail : String,
  password: String,
});
const User = mongoose.model("user", userSchema);

export default User;
