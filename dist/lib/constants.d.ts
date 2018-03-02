export declare const SchemaValidatorClass: string;
export declare const SystemClass: {
    HttpKernel: string;
    HttpDriver: string;
    ExpressSessionStore: string;
};
export declare const AuthClass: {
    Auth: string;
    SessionGuard: string;
    JwtGuard: string;
    UserProvider: string;
};
export declare const ContextualFacadeClass: {
    Input: string;
    Session: string;
};
export declare const ResponseTypeClass: {
    Back: string;
    Json: string;
    Jsonp: string;
    Redirect: string;
    View: string;
    HandlebarsView: string;
};
export declare const GlobalFacadeClass: {
    Application: string;
    Cache: string;
    Config: string;
    Event: string;
    Log: string;
    Path: string;
    Redis: string;
    Response: string;
    Route: string;
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
    Middleware: {
        csurfOptions: string;
        corsOptions: string;
    };
    Cache: {
        engine: string;
        redis: string;
    };
};
