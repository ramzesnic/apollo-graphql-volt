import config from './config';
import utils from './utils';
import models from './models';
import services from './services';

const init = (injectableObjs: any, injectData: any) => {
  return Object.keys(injectableObjs).reduce(
    (acc, name) => ({
      ...acc,
      serviceName: injectableObjs[name](injectData),
    }),
    {},
  );
};

export default {
  config,
  utils,
  models,
  services: init(services, { config, utils, models }),
};
