import { Request, Response } from "express";
import db from "../config/db.config";
import Profile from "../models/profile.model";
import { UserAuthRequest } from "../types/request";

const userBoard = (req: Request, res: Response) => {
  res.status(200).send("User Content");
};

/**
 * Return User if it exist
 * @param req.params.id - user id
 */
const getUser = (req: UserAuthRequest, res: Response) => {
  if (req.userId !== req.params.id) {
    return res
      .status(403)
      .send({ error: "Token user id does not match requested id" });
  }

  db.user
    .findOne({
      where: {
        id: req.params.id,
      },
      include: [Profile],
    })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .send({ error: `user id {${req.params.id}} doesn't exist` });
      }

      return res.send(user);
    });
};
/**
 * Update user info as well as profile info
 * @param req.params.id - user
 */
const updateUser = (req: UserAuthRequest, res: Response) => {
  if (req.userId !== req.params.id) {
    return res
      .status(403)
      .send({ error: "Token user id does not match requested id" });
  }

  db.user
    .findOne({
      where: {
        id: req.params.id,
      },
      include: [Profile],
    })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .send({ error: `user id {${req.params.id}} doesn't exist` });
      } else {
        user.update({ ...req.body }).then((user) => {
          user
            .$get("profile")
            .then((profile) =>
              profile
                ?.update({ ...req.body.profile })
                .then(() => res.send(user))
            );
        });
      }
    });
};

/**
 * Delete User if it exist
 * @param req.params.id - user id to delete
 */
const deleteUser = (req: UserAuthRequest, res: Response) => {
  if (req.userId !== req.params.id) {
    return res
      .status(403)
      .send({ error: "Token user id does not match requested id" });
  }

  db.user
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((user) => {
      if (!user) {
        return res.send({ error: `user id {${req.params.id}} doesn't exist` });
      } else {
        user
          .destroy()
          .then(() => res.send({ message: "Delete user successful" }));
      }
    });
};

const userController = {
  userBoard,
  getUser,
  updateUser,
  deleteUser,
};
export default userController;
