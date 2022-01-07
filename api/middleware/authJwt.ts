import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db.config";
import { UserAuthRequest } from "../types/request";

const default_secret = (Math.random() * 1000).toString();

/**
 * Verify the token (from cookie or header)
 * @param req
 */
const verifyToken = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers["x-access-token"] || req.cookies?.jwt;
  let key = req.headers["authorization"];
  key = key?.split(" ")[1];

  if (!token && !key) {
    return res.status(403).send({ message: "No token/api key provided" });
  }

  if (token) {
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
  } else if (key) {
    // verify apikey
    db.user
      .findOne({
        where: {
          apiKey: key,
        },
      })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .send({ message: "API Key does not belong to any user" });
        }
        jwt.verify(
          key!,
          process.env.JWT_SECRET || default_secret,
          (err, decoded) => {
            if (err) {
              return res.status(401).send({ message: "Invalid API Key!" });
            }
            req.userId = decoded?.id;
            next();
          }
        );
      });
  }
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

/**
 * Verify the id from the token is matching the user id from the request
 * NOTE: Needs to be placed after verifyToken to work
 */
const verifyTokenIdMatching = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userId != req.params.id) {
    return res
      .status(403)
      .send({ error: "Token user id does not match requested id" });
  }
  next();
};

const authJwt = {
  isAdmin,
  verifyToken,
  verifyTokenIdMatching,
  default_secret,
};
export default authJwt;
