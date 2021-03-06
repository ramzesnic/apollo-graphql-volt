import { Service } from 'typedi';
import AWS from 'aws-sdk';
import { AppConfiguration } from '../config';
import { Stream } from 'stream';

@Service()
export class Aws3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(private readonly config: AppConfiguration) {
    const {
      awsId: accessKeyId,
      awsSecret: secretAccessKey,
      awsLocation: region,
      awsBucketName,
    } = this.config.awsConfig;

    this.bucketName = awsBucketName;
    this.s3 = new AWS.S3({ accessKeyId, secretAccessKey, region });
  }

  async uploadFile(
    fileName: string,
    body: Stream,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    this.s3.createBucket({ Bucket: this.bucketName }, (err, data) => {
      if (err) {
        console.log('Error', err);
      }
    });
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: body,
    };

    return this.s3.upload(params).promise();
  }
}
