
const jwt = require('jsonwebtoken');

// Authentication Middleware
// const auth = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach the decoded token (user info) to the request object
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     res.status(400).json({ success: false, error: 'Invalid token.' });
//   }
// };
const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  // Split the "Bearer <token>" format and extract the actual token
  const tokenWithoutBearer = token.split(' ')[1]; // 'Bearer <token>'

  if (!tokenWithoutBearer) {
    return res.status(401).json({ success: false, error: 'Invalid token format.' });
  }

  try {
    // Verify the token using your JWT secret
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token (user info) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('JWT verification error:', error); // Log the error for debugging
    res.status(400).json({ success: false, error: 'Invalid token.' });
  }
};
// Authorization Middleware
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You do not have the required role.',
      });
    }
    next(); // If the role matches, proceed to the next middleware or route handler
  };
};

module.exports = { auth, authorizeRole };


// const jwt = require("jsonwebtoken");

// // Authentication Middleware
// const auth = (req, res, next) => {
//  const token = req.header("Authorization");

//  if (!token) {
//   return res
//    .status(401)
//    .json({ success: false, error: "Access denied. No token provided." });
//  }

//  try {
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = decoded; // Attach the decoded token (user info) to the request object
//   next();
//  } catch (error) {
//   res.status(400).json({ success: false, error: "Invalid token." });
//  }
// };

// // Authorization Middleware
// const authorizeRole = (role) => {
//  return (req, res, next) => {
//   if (!req.user || req.user.role !== role) {
//    return res.status(403).json({
//     success: false,
//     error: "Access denied. You do not have the required role.",
//    });
//   }
//   next();
//  };
// };

// module.exports = { auth, authorizeRole };
