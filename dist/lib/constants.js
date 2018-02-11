"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpDriverClass = 'HttpDriver';
exports.LoggerClass = 'Logger';
exports.HttpKernelClass = 'HttpKernel';
exports.SchemaValidatorClass = 'SchemaValidator';
exports.GlobalFacade = {
    Application: 'Najs.Application',
    Cache: 'Najs.Cache',
    Config: 'Najs.Config',
    Path: 'Najs.Path'
};
/**
 * This Object Configuration's key
 */
exports.ConfigurationKeys = {
    CWD: 'cwd',
    ViewEngineName: 'view.engine',
    HandlerBarsOptions: 'view.handlebars',
    Paths: {
        app: 'path.app',
        config: 'path.config',
        layout: 'path.layout',
        public: 'path.public',
        resource: 'path.resources',
        route: 'path.route',
        storage: 'path.storage',
        view: 'path.view'
    },
    Middleware: {
        csurfOptions: 'middleware.csurf',
        corsOptions: 'middleware.cors'
    },
    Cache: {
        engine: 'cache.engine',
        redis: 'cache.redis'
    },
    NajsOptions: {
        port: 'port',
        host: 'host'
    }
};
