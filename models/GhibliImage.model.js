import mongoose, { Schema } from "mongoose";

const ghibliImageSchema = new Schema(
    {
        userEmail: { type: String, required: true },
        prompt: { type: String, default: "Converted to Ghibli Style 🎨" },
        originalUrl: { type: String, required: true },
        ghibliUrl: { type: String, required: true },
    },
    { timestamps: true }
);

const GhibliImage =
    mongoose.models.GhibliImage || mongoose.model("GhibliImage", ghibliImageSchema);

export default GhibliImage;
