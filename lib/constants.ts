export const SchemaValidatorClass: string = 'SchemaValidator'

export const Najs = {
  Application: 'Najs.Application',
  Config: 'Najs.Config',
  Cache: {
    RedisCache: 'Najs.Cache.RedisCache'
  },
  Event: {
    EventDispatcher: 'Najs.Event.EventDispatcher'
  },
  FileSystem: {
    Path: 'Najs.FileSystem.Path'
  },
  Log: {
    WinstonLogger: 'Najs.Log.WinstonLogger'
  },
  Redis: {
    RedisClient: 'Najs.Redis.RedisClient'
  },
  Http: {
    HttpDriver: 'Najs.Http.HttpDriver',
    ExpressHttpDriver: 'Najs.Http.ExpressHttpDriver',
    Cookie: 'Najs.Http.Cookie',
    RouteFactory: 'Najs.Http.RouteFactory',
    ResponseFactory: 'Najs.Http.ResponseFactory',
    Response: {
      BackResponse: 'Najs.Http.Response.BackResponse',
      JsonResponse: 'Najs.Http.Response.JsonResponse',
      JsonpResponse: 'Najs.Http.Response.JsonpResponse',
      RedirectResponse: 'Najs.Http.Response.RedirectResponse',
      ViewResponse: 'Najs.Http.Response.ViewResponse',
      HandlebarsViewResponse: 'Najs.Http.Response.HandlebarsViewResponse'
    }
  },
  Test: {
    SuperTestExpectation: {
      JsonExpectation: 'Najs.Test.SuperTestExpectation.JsonExpectation'
    }
  }
}

export const SystemClass = {
  HttpKernel: 'Najs.HttpKernel',
  ExpressSessionStore: 'Najs.ExpressSessionStore'
}

export const AuthEvent = {
  Login: 'auth.login',
  Logout: 'auth.logout',
  Attempt: 'auth.attempt'
}

export const AuthClass = {
  Auth: 'Najs.Auth',
  SessionGuard: 'Najs.SessionGuard',
  JwtGuard: 'Najs.JwtGuard',
  EloquentUserProvider: 'Najs.EloquentUserProvider',
  GenericUser: 'Najs.GenericUser',
  LoginController: 'Najs.LoginController'
}

export const ContextualFacadeClass = {
  Auth: 'Najs.AuthManager',
  Input: 'Najs.RequestInput',
  Session: 'Najs.Session'
}

/**
 * This Object Configuration's key
 */
export const ConfigurationKeys = {
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
}
