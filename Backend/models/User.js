import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    grad_year: {
        type: String,
        required: true,
    },

    dept: {
        type: String,
        enum: [
            "CSE",
            "AIDS",
            "AIML",
            "CYBER",
            "IOT",
            "IT",
            "ECE",
            "EEE",
            "EIE",
            "MECH",
            "CIVIL",
            "CHEM",
            "BME",
            "MED",
        ],
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    sem_total: {
        type: Object,
    },
    courses: {
        type: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: "courses.modelType",
                    required: true,
                },
                modelType: {
                    type: String,
                    required: true,
                    enum: ["NonScoftCourse", "Course"],
                },
                gradePoint: {
                    type: Number,
                    required: true,
                },
                grade: {
                    type: String,
                    required: true,
                },
                sem: {
                    type: String,
                    required: true,
                },
                category: {
                    type: String,
                    enum: ["HS", "BS", "ES", "PC", "PE", "OE", "EEC", "MC"],
                    required: true,
                },
            },
        ],
    },
    user_added_courses: {
        type: [
            {
                course_name: {
                    type: String,
                    required: true,
                },
                code: {
                    type: String,
                    required: true,
                    unique: true,
                },
                credits: {
                    type: Number,
                    required: true,
                },
                gradePoint: {
                    type: Number,
                    required: true,
                },
                grade: {
                    type: String,
                    required: true,
                },
                sem: {
                    type: String,
                    required: true,
                },
                category: {
                    type: String,
                    enum: ["HS", "BS", "ES", "PC", "PE", "OE", "EEC", "MC"],
                    required: true,
                },
            },
        ],
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.compare = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
