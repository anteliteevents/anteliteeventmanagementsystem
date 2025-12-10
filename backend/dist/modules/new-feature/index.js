"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moduleConfig = {
    metadata: require('./module.json'),
    path: __dirname,
    routes: (router) => {
        router.use('/new-feature', (0, express_1.Router)());
    },
    initialize: async () => {
        console.log('New Feature module: Placeholder initialized');
    }
};
exports.default = moduleConfig;
//# sourceMappingURL=index.js.map