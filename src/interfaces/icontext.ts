import { User } from '../models/user';

export interface IContext {
  user?: Partial<User>;
}
