import mongoose from "mongoose";

const NonScoftCourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code19: {
        type: String,
        required: true,
        unique: true
    },
    code24: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true
    },
    department: {
        type: Object,
        required: true
    }
});

const NonScoftCourse = mongoose.model('NonScoftCourse', NonScoftCourseSchema);

export default NonScoftCourse;