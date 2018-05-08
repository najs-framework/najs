"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidatorClass = 'SchemaValidator';
exports.Najs = {
    Config: 'Najs.Config',
    Cache: {
        RedisCache: 'Najs.Cache.RedisCache'
    },
    FileSystem: {
        Path: 'Najs.FileSystem.Path'
    },
    Log: {
        WinstonLogger: 'Najs.Log.WinstonLogger'
    },
    Redis: {
        RedisClient: 'Najs.Redis.RedisClient'
    }
};
exports.SystemClass = {
    HttpKernel: 'Najs.HttpKernel',
    HttpDriver: 'Najs.HttpDriver',
    ExpressSessionStore: 'Najs.ExpressSessionStore'
};
exports.AuthEvent = {
    Login: 'auth.login',
    Logout: 'auth.logout',
    Attempt: 'auth.attempt'
};
exports.AuthClass = {
    Auth: 'Najs.Auth',
    SessionGuard: 'Najs.SessionGuard',
    JwtGuard: 'Najs.JwtGuard',
    EloquentUserProvider: 'Najs.EloquentUserProvider',
    GenericUser: 'Najs.GenericUser',
    LoginController: 'Najs.LoginController'
};
exports.ContextualFacadeClass = {
    Auth: 'Najs.AuthManager',
    Input: 'Najs.RequestInput',
    Session: 'Najs.Session',
    Cookie: 'Najs.Cookie'
};
exports.ResponseTypeClass = {
    Back: 'Najs.BackResponse',
    Json: 'Najs.JsonResponse',
    Jsonp: 'Najs.JsonpResponse',
    Redirect: 'Najs.RedirectResponse',
    View: 'Najs.ViewResponse',
    HandlebarsView: 'Najs.HandlebarsViewResponse'
};
exports.GlobalFacadeClass = {
    Application: 'Najs.Application',
    Event: 'Najs.EventDispatcher',
    Response: 'Najs.ResponseFactory',
    Route: 'Najs.RouteFactory'
};
/**
 * This Object Configuration's key
 */
exports.ConfigurationKeys = {
    Port: 'port',
    Host: 'host',
    ViewEngineName: 'view.engine',
    HandlebarsOptions: 'view.handlebars',
    Session: 'session',
    Redis: 'redis',
    Mongoose: 'mongoose.uri',
    MongooseOptions: 'mongoose.options',
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
    Auth: {
        guards: 'auth.guards',
        jwtGuard: 'auth.JwtGuardOptions',
        url: 'auth.url'
    },
    Cookie: {
        secret: 'cookie.secret',
        options: 'cookie.options'
    },
    Middleware: {
        csurfOptions: 'middleware.csurf',
        corsOptions: 'middleware.cors'
    },
    Cache: {
        engine: 'cache.engine',
        redis: 'cache.redis'
    }
};
