import jwt from "jsonwebtoken";

export const authMiddleware = async function (req, res, next) {
  //  Run something in the middle
  try {
    const bearer = req.headers["authorization"];
    const token = bearer.replace("Bearer ", "");

    const payload = jwt.verify(token, "secretKey");

    req.payload = payload;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not Authorized", error });
  }
};
