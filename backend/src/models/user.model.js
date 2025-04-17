import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            set: (value) => value.toLowerCase(),
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            set: (value) => value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        profilePic: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
        authenticatedEmail: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["Artist", "Writer", "Dual Creator", "Enthusiast"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Open for Projects", "Ultra Focused", "Taking a Creative Nap", "Will Be Back Soon"],
            default: "Open for Projects",
            required: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now(),
        },
        location: {
            type: String,
        },
        numberOfFollowers: {
            type: Number,
            default: 0,
        },
        numberofFollowing: {
            type: Number,
            default: 0,
        }

    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);

export default User;