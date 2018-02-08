"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("./make");
const constants_1 = require("../constants");
exports.Najs = {
    rootPath: '',
    app: undefined,
    cwd(cwd) {
        this.rootPath = cwd;
        return this;
    },
    providers(providers) {
        return this;
    },
    start(arg) {
        const httpDriver = make_1.make(constants_1.HttpDriverClass);
        httpDriver.start({});
    }
};
exports.Najs.cwd(__dirname)
    .providers([])
    .start();
const Test = {};
Test.workingDirectory(__dirname)
    .classes(require('autoload.ts'))
    .providers([
    'CacheProvider',
    'RedisProvider',
    'MongooseProvider',
    'ValidationProvider',
    'LoggerProvider',
    'HttpDriverProvider'
])
    .on('booting', function () { })
    .on('booted', function () { })
    .on('crashed', function () { })
    .start();
