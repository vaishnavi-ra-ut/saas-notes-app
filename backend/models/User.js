// backend/models/User.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },             // 👈 add name if you use it in signup
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },         // bcrypt hash
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  tenant: { type: String, default: "default" },       // tenant slug
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
