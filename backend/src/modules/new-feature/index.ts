import { Express, Router } from 'express';
import { ModuleConfig } from '../../core/module-loader';

const moduleConfig: ModuleConfig = {
  metadata: require('./module.json'),
  path: __dirname,
  routes: (app: Express | Router) => {
    const router = Router();
    app.use('/new-feature', router);
  },
  initialize: async () => {
    console.log('New Feature module: Placeholder initialized');
  }
};

export default moduleConfig;

