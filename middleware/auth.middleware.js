const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
 const token = req.header("Authorization");

 if (!token || !token.startsWith("Bearer ")) {
  return res
   .status(401)
   .json({ success: false, error: "Access denied. No token provided." });
 }

 try {
  const tokenPart = token.split(" ")[1]; // Extract the token part after "Bearer "
  const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);
  req.user = decoded; // Attach the decoded token (user info) to the request object
  next();
 } catch (ex) {
  res.status(400).json({ success: false, error: "Invalid token." });
 }
};

exports.authorizeRoles = (...roles) => {
 return (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
   return res.status(403).json({
    success: false,
    error: "Access denied. You do not have the required role.",
   });
  }
  next();
 };
};

// const jwt = require("jsonwebtoken");
// // const User = require("../model/user/User");
// // const Admin = require("../model/user/Admin");

// exports.authenticate = (req, res, next) => {
//  const token = req.header("Authorization").replace("Bearer ", "");

//  if (!token) {
//   return res
//    .status(401)
//    .json({ success: false, error: "Access denied. No token provided." });
//  }

//  try {
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = decoded;
//   next();
//  } catch (ex) {
//   res.status(400).json({ success: false, error: "Invalid token." });
//  }
// };

// exports.authorizeRoles = (...roles) => {
//  return (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//    return res.status(403).json({ success: false, error: "Access denied." });
//   }
//   next();
//  };
// };
