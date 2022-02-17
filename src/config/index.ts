import { SequelizeOptions } from 'sequelize-typescript';
import { Service } from 'typedi';
import getDbCongif from './db.config';
import getMailConfig from './mail.config';

@Service()
export class AppConfiguration {
  private db = getDbCongif(process.env.NODE_ENV);
  private mail = getMailConfig();
  private appPort = parseInt(process.env.PORT) || 4000;
  private jwtSecret = process.env.JWT_SECRET;
  private jwtExpiresIn = parseInt(process.env.JWT_EXPIRES_MIN) * 60;
  private awsId = process.env.AWS_ID;
  private awsSecret = process.env.AWS_SECRET;
  private awsBucketName = process.env.AWS_BUCKET_NAME;
  private awsLocation = process.env.AWS_LOCATION;
  private imageX = parseInt(process.env.IMAGE_X);
  private imageY = parseInt(process.env.IMAGE_Y);
  private maxFileSize = parseInt(process.env.MAX_FILE_SIZE) * 1000 * 1000;
  private allowFileTypes: string[] = process.env.ALLOW_FILE_TYPES.split(',');

  get dbConfig(): Partial<SequelizeOptions> {
    return this.db;
  }

  get port(): number {
    return this.appPort;
  }

  get secret(): string {
    return this.jwtSecret;
  }

  get jwtExpires(): number {
    return this.jwtExpiresIn;
  }

  get awsConfig(): any {
    return {
      awsId: this.awsId,
      awsSecret: this.awsSecret,
      awsBucketName: this.awsBucketName,
      awsLocation: this.awsLocation,
    };
  }

  get imageConfig(): any {
    return {
      imageX: this.imageX,
      imageY: this.imageY,
      maxFileSize: this.maxFileSize,
      allowFileTypes: this.allowFileTypes,
    };
  }

  get mailConfig(): any {
    return this.mail;
  }
}
