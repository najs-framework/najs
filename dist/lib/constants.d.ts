export declare const SchemaValidatorClass: string;
export declare const Najs: {
    Application: string;
    Config: string;
    Cache: {
        RedisCache: string;
    };
    FileSystem: {
        Path: string;
    };
    Log: {
        WinstonLogger: string;
    };
    Redis: {
        RedisClient: string;
    };
    Http: {
        HttpDriver: string;
        ExpressHttpDriver: string;
        Cookie: string;
        RouteFactory: string;
        ResponseFactory: string;
        Response: {
            BackResponse: string;
            JsonResponse: string;
            JsonpResponse: string;
            RedirectResponse: string;
            ViewResponse: string;
            HandlebarsViewResponse: string;
        };
    };
};
export declare const SystemClass: {
    HttpKernel: string;
    ExpressSessionStore: string;
};
export declare const AuthEvent: {
    Login: string;
    Logout: string;
    Attempt: string;
};
export declare const AuthClass: {
    Auth: string;
    SessionGuard: string;
    JwtGuard: string;
    EloquentUserProvider: string;
    GenericUser: string;
    LoginController: string;
};
export declare const ContextualFacadeClass: {
    Auth: string;
    Input: string;
    Session: string;
};
export declare const GlobalFacadeClass: {
    Event: string;
};
/**
 * This Object Configuration's key
 */
export declare const ConfigurationKeys: {
    Port: string;
    Host: string;
    ViewEngineName: string;
    HandlebarsOptions: string;
    Session: string;
    Redis: string;
    Mongoose: string;
    MongooseOptions: string;
    Paths: {
        app: string;
        config: string;
        layout: string;
        public: string;
        resource: string;
        route: string;
        storage: string;
        view: string;
    };
    Auth: {
        guards: string;
        jwtGuard: string;
        url: string;
    };
    Cookie: {
        secret: string;
        options: string;
    };
    Middleware: {
        csurfOptions: string;
        corsOptions: string;
    };
    Cache: {
        engine: string;
        redis: string;
    };
};
