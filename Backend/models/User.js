import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    reg_no: {
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
                    ref: "Course",
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
            },
        ],
    },
});

UserSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.compare = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
