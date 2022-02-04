import { AppConfiguration } from '../../config';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';

@Service()
export class BearerMiddleware implements MiddlewareInterface<any> {
  constructor(private readonly config: AppConfiguration) {}

  async use(context: any, next: NextFn) {
    const authorization: string = context?.req?.headers?.authorization || '';
    const result = await next();
    if (!authorization.startsWith('Bearer ')) {
      return result;
    }
    const token = authorization.split(' ')[1];

    try {
      result.context.user = jwt.verify(token, this.config.secret);
    } catch {}
    return result;
  }
}
