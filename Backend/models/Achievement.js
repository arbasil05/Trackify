import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String, // Ideally to show users what this is
    },
    icon: {
        type: String, // String identifier for FontAwesome icon (e.g., "trophy")
        required: true
    },
    type: {
        type: String,
        enum: ["TOTAL_CREDITS", "SEMESTER_CREDITS", "SEMESTER_GRADES", "CATEGORY_COMPLETE"],
        required: true,
    },
    condition: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true,
    },
    category: {
        type: String, // For grouping or specific category related achievements
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
