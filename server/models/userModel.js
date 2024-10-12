import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    content: String,
    expirationDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
// Create the TTL index
statusSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

const Status = mongoose.model("Status", statusSchema);

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: String,
    about: {
        dateOfBirth: Date,
        gender: String,
        campus: String,
        standing: String,
        major: String,
        skills: [String],
        hobbies: [String],
        socials: [String],
        bio: String,
    },
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status"
    },
    embedding: []
});

const User = mongoose.model("User", userSchema);

export { User, Status };