import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
},{
    timestamps: true,
    });

export default mongoose.model("User", userSchema);