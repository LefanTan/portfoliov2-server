import { Request, Response } from "express";
import db from "../config/db.config";
import portfolioStorage from "../config/storage.config";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";

const fs = require("fs");

const getProfile = (req: Request, res: Response) => {
  db.profile
    .findOne({
      where: {
        userId: req.params.userId,
      },
    })
    .then((profile) => {
      if (!profile) {
        return res.status(400).send({
          error: `No profile of user id - ${req.params.userId} found`,
        });
      }

      return res.send(profile);
    });
};

/**
 * Update or create a profile belonged to a userid
 * @param req.params.userId this function uses the profile belonged to this user
 * @param res
 */
const updateProfile = (req: Request, res: Response) => {
  db.profile
    .findOrCreate({
      where: {
        userId: req.params.userId,
      },
    })
    .then(async ([profile, created]) => {
      if (!created && !profile) {
        return res.status(400).send({
          error: `Could not find or create a profile for user id ${req.params.userId}`,
        });
      }

      let mainMediaUrl: string = req.body.mainMediaUrl || "";

      // Normalize req.body.mediaUrls to be an array
      let mediaUrls: string[] = req.body.mediaUrls
        ? Array.isArray(req.body.mediaUrls)
          ? req.body.mediaUrls
          : [req.body.mediaUrls]
        : [];
      let resumeUrl: string = req.body.resumeUrl || "";

      if (req.files?.mainMedia && !Array.isArray(req.files?.mainMedia)) {
        mainMediaUrl = await portfolioStorage.uploadFile(
          portfolioStorage.profileBucket,
          req.files?.mainMedia.tempFilePath,
          `${profile.userId}/${req.files?.mainMedia.name}`
        );

        // Delete all file after they're uploaded
        try {
          fs.unlinkSync(req.files?.mainMedia.tempFilePath);
        } catch (err) {
          console.error(err);
        }
      }

      if (req.files?.resume && !Array.isArray(req.files?.resume)) {
        resumeUrl = await portfolioStorage.uploadFile(
          portfolioStorage.profileBucket,
          req.files?.resume.tempFilePath,
          `${profile.userId}/${req.files?.resume.name}`
        );

        // Delete file after they're uploaded
        try {
          fs.unlinkSync(req.files?.resume.tempFilePath);
        } catch (err) {
          console.error(err);
        }
      }

      if (req.files?.medias) {
        // Normalizing req.files?.medias to be an array
        const mediaFiles: UploadedFile[] = Array.isArray(req.files.medias)
          ? req.files.medias
          : [req.files.medias];
        let tasks: Promise<string>[] = [];

        mediaFiles.forEach(async (media) => {
          tasks.push(
            portfolioStorage.uploadFile(
              portfolioStorage.profileBucket,
              media.tempFilePath,
              `${profile.userId}/${media.name}`
            )
          );
        });

        mediaUrls = mediaUrls.concat(await Promise.all(tasks));

        // Delete all files after they're uploaded
        mediaFiles.forEach((media) => {
          try {
            fs.unlinkSync(media.tempFilePath);
          } catch (err) {
            console.error(err);
          }
        });
      }
      console.log(resumeUrl);
      profile
        .update({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          aboutMe: req.body.aboutMe,
          skills: req.body.skills,
          linkedin: req.body.linkedin,
          github: req.body.github,
          resumeUrl: resumeUrl,
          mainMediaUrl: mainMediaUrl,
          mediaUrls: mediaUrls,
        })
        .then((profile) => {
          // Delete all files not used by checking if the file name is present
          // in any of the links
          // This is by no means efficient, because uuid changes everytime,
          // the same file might be replaced instead of getting reused again,
          // Definitely should revisit this function
          portfolioStorage.profileBucket
            .getFiles({ autoPaginate: false, prefix: `${profile.userId}` })
            .then((data) => {
              // Overkill for sure, but I wanted to play around with
              // regex a little!
              let regex = new RegExp(`^(${profile.userId}\/)`, "g");

              data[0].forEach((file) => {
                let fileName = encodeURIComponent(file.name.replace(regex, ""));

                if (
                  profile.mainMediaUrl?.includes(fileName) ||
                  profile.resumeUrl?.includes(fileName) ||
                  profile.mediaUrls?.find((url) => url.includes(fileName))
                ) {
                  return;
                }

                console.log(`Deleting ${fileName}...`);
                portfolioStorage.profileBucket.file(file.name).delete();
              });

              res.send(profile);
            });
        })
        .catch((err) => res.status(400).send({ error: err }));
    });
};

const profileController = {
  getProfile,
  updateProfile,
};

export default profileController;
