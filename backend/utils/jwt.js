import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};
