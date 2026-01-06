const { User } = require("../models/models");
const express = require("express");
const auth_router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "zarashoppingsite";
const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET);
}

function getUserFromToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return User.findOne({ where: { user_id: decoded.id } });
    } catch (error) {
        return null;
    }
}

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    
    const user = await getUserFromToken(token);
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
}

auth_router.post("/signup", async (req, res) => {
    const { email, password, name, phone } = req.body;
    const user = await User.create({ name, email, password, phone });
    
    const token = generateToken(user);
    res.status(201).json({ "token": token });
});

auth_router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.status(200).json({ "token": token, "role": user.role });
});

auth_router.post("/admin_signup", async (req, res) => {
    const { email, password, secretKey } = req.body;
    
    // Check if the secret key is valid
    if (secretKey !== process.env.ADMIN_SECRET_KEY && secretKey !== "admin123") {
        return res.status(403).json({ message: "Invalid secret key" });
    }
    
    const user = await User.findOne({ where: { email } });
    const role = user.role;
    
    const token = generateToken(user);

    res.status(201).json({ "token": token, role });
});


module.exports = { auth_router, authMiddleware };

