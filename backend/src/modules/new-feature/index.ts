import { Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  routes: (router: Router) => {
    router.use('/new-feature', Router());
  },
  initialize: async () => {
    console.log('New Feature module: Placeholder initialized');
  }
};

export default moduleConfig;

