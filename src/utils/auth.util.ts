import * as jwt from 'jsonwebtoken';

export class AuthUtil {
  private static getToken = (req: any) => {
    const authorization: string = req?.headers?.authorization || '';
    if (!authorization.startsWith('Bearer ')) {
      return '';
    }
    return authorization.split(' ')[1];
  };

  static varifyUser =
    (secret: string) =>
    ({ req }: any) => {
      try {
        const token = AuthUtil.getToken(req);
        const user = jwt.verify(token, secret);
        return {
          headers: req?.headers,
          user,
        };
      } catch (e) {
        //console.log(e);
        return {
          headers: req?.headers,
        };
      }
    };
}
