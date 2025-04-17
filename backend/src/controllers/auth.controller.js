import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from"../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, username, email, password, role } = req.body;
    try {
        // check if all fields are filled
        if (!fullName || !username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required."});
        }

        // validate password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        // check if user already exists
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create the new user
        const newUser = new User({
            fullName: fullName,
            username: username,
            email: email,
            password: hashedPassword,
            role: role
        });

        // genereate token, send cookie with res and give response
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                profilePic: newUser.profilePic,
                authenticatedEmail: newUser.authenticatedEmail,
            });

        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password ) {
            return res.status(400).json({ message: "All fields are required."});
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            authenticatedEmail: user.authenticatedEmail,
        });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({ message: "Logged out successfully!"});
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required." });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture: uploadResponse.secure_url}, {new:true});

        res.status(200).json({updatedUser})

    } catch (error) {
        console.log("Error in update profile: ", error);
        res.status(500).json({ message: "Internet server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};
