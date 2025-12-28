import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      phone: user.phone,
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "7d" }
  );
};
