import { Schema, model } from "mongoose";

const missingCourseSchema = new Schema({
    name: String,
    code: String,
    category: String,
    credits: Number,
    submittedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

missingCourseSchema.index({ code: 1 }, { unique: true });

export default model("MissingCourse", missingCourseSchema);
