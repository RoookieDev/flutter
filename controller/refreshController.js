const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
require("dotenv").config();

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: "No refresh token" });
  }

  const user = await userModel.findOne({ refreshToken });

  if (!user) {
    return res.status(403).json({ msg: "Invalid refresh token" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: "Refresh expired" });
      }

      // 🔐 Create new access token
      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      // 🔐 Rotate refresh token (recommended)
      const newRefreshToken = jwt.sign(
        { userId: decoded.userId },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      user.refreshToken = newRefreshToken;
      await user.save();

      return res.json({
        token: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};
