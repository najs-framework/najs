"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpDriverClass = 'HttpDriver';
exports.LoggerClass = 'Logger';
exports.HttpKernelClass = 'HttpKernel';
exports.CacheClass = 'Cache';
/**
 * This Object Configuration's key
 */
exports.ConfigurationKeys = {
    CWD: 'cwd',
    ViewEngineName: 'view.engine',
    HandlerBarsOptions: 'view.handlebars',
    Paths: {
        app: 'path.app',
        base: 'cwd',
        config: 'path.config',
        layout: 'path.layout',
        public: 'path.public',
        resource: 'path.resources',
        route: 'path.route',
        storage: 'path.storage',
        view: 'path.view'
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
