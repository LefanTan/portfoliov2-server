import { DownloadOptions, Storage } from "@google-cloud/storage";

class PortfolioStorage {
  storage = new Storage();
  profileBucketName = "profile-bucket";
  projectBucketName = "project-bucket";

  constructor() {
    // If buckets not created, create one
    if (!this.storage.bucket(this.profileBucketName)) {
      this.createBucket(this.profileBucketName);
    }

    if (!this.storage.bucket(this.projectBucketName)) {
      this.createBucket(this.projectBucketName);
    }
  }

  async createBucket(bucketName: string) {
    await this.storage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} successfully created`);
  }

  async uploadFile(bucketName: string, path: string, fileName: string) {
    await this.storage
      .bucket(bucketName)
      .upload(path, { destination: fileName });

    console.log(
      `File - {${path + fileName}} successfully upload to ${bucketName}`
    );
  }

  async downloadFile(
    bucketName: string,
    filePath: string,
    options: DownloadOptions
  ) {
    await this.storage.bucket(bucketName).file(filePath).download(options);
  }
}

const portfolioStorage = new PortfolioStorage();
export default portfolioStorage;
