import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  full_name: {
    type: String,
    required: [true, "Full name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  image_link: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
