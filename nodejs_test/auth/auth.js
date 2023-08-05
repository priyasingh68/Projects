// const { verify } = require("jsonwebtoken");
// const userModel = require("./userModel"); // Import your user model

// module.exports = {
//   verifyToken: async (req, res, next) => {
//     try {
//       let token = req.headers.token;
//       verify(token, "Abcde12", (err, decoded) => {
//         if (err) {
//           if (err.name === "TokenExpiredError") {
//             return res.status(401).json({ message: "Token expired" });
//           } else {
//             return res.status(401).json({ message: "Invalid token" });
//           }
//         }

//         userModel.findOne({ _id: decoded._id }, (err, user) => {
//           if (err) {
//             return res.status(500).json({ message: "Internal server error" });
//           } else if (!user) {
//             return res.status(404).json({ message: "User not found" });
//           } else {
//             req.userId = user._id;
//             next();
//           }
//         });
//       });
//     } catch (error) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };
