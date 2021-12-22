import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../models";
import { UserAuthRequest } from "../types/request";

const default_secret = (Math.random() * 1000).toString();

const verifyToken = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  // TODO: use better algorithm for the default secret key!
  jwt.verify(
    token as string,
    process.env.JWT_SECRET || default_secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid JWT token!" });
      }
      req.userId = decoded?.id;
      next();
    }
  );
};

const isAdmin = (req: UserAuthRequest, res: Response, next: NextFunction) => {
  db.user.findByPk(req.userId).then((user) => {
    if (user) {
      user.$get("roles").then((roles) => {
        if (roles.find((role) => role.name === "admin")) {
          next();
        }
      });
    }
    return res.status(401).send({ message: "User is not an admin!" });
  });
};

const authJwt = {
  isAdmin: isAdmin,
  verifyToken: verifyToken,
  default_secret: default_secret,
};
export default authJwt;
