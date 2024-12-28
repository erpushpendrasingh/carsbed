const express = require("express");
const {
 forgotPassword,
 resetPassword,
} = require("../../controller/userControllers/authController");
const forgotRouter = express.Router();

// Forgot password route
forgotRouter.post("/forgot-password", forgotPassword);

// Reset password route
forgotRouter.post("/reset-password/:token", resetPassword);

module.exports = forgotRouter;
