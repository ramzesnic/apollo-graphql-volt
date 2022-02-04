import { AuthChecker } from 'type-graphql';
import { IContext } from '../../interfaces/icontext';

export const userAuthChecker: AuthChecker<IContext> = (ctx) => {
  //console.log('===========guard========');
  //console.log(ctx);
  return !!ctx.context.user;
};
