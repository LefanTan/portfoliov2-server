import { Bucket, DownloadOptions, Storage } from "@google-cloud/storage";
import moment from "moment";

require("dotenv").config();

class PortfolioStorage {
  storage = new Storage();
  profileBucket = this.storage.bucket(
    process.env.NODE_ENV !== "production"
      ? "test-profile-bucket"
      : "profile-bucket"
  );
  projectBucket = this.storage.bucket(
    process.env.NODE_ENV !== "production"
      ? "test-projects-bucket"
      : "projects-bucket"
  );

  async createBucket(bucketName: string) {
    try {
      await this.storage.createBucket(bucketName);
      console.log(`Bucket ${bucketName} successfully created`);
    } catch (err) {
      console.error(err);
    }
  }

  async uploadFile(
    bucket: Bucket,
    path: string,
    fileName: string
  ): Promise<string> {
    try {
      const res = await bucket.upload(path, { destination: fileName });
      console.log(
        `File - {${path + fileName}} successfully upload to ${bucket.name}`
      );

      return res[0]
        .getSignedUrl({
          action: "read",
          // Wonky way to create an indefinite url
          // (which just makes it a public url)
          // OPTIONAL TODO: Create a signed url linked to JWT Token
          expires: moment().add(100, "years").format("DD-MM-YYYY"),
        })
        .then((data) => data[0])
        .catch(() => {
          throw Error("Getting signed url failed");
        });
    } catch (err) {
      console.error(err);
      throw Error("Upload failed");
    }
  }

  async downloadFile(
    bucket: Bucket,
    filePath: string,
    options: DownloadOptions
  ) {
    try {
      await bucket.file(filePath).download(options);
    } catch (err) {
      console.error(err);
    }
  }
}

const portfolioStorage = new PortfolioStorage();
export default portfolioStorage;
