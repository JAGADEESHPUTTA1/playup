import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "7d",
  });
};
