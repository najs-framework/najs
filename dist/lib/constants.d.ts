export declare const HttpDriverClass: string;
export declare const LoggerClass: string;
export declare const HttpKernelClass: string;
export declare const SchemaValidatorClass: string;
export declare const GlobalFacade: {
    Application: string;
    Cache: string;
    Config: string;
    Path: string;
};
/**
 * This Object Configuration's key
 */
export declare const ConfigurationKeys: {
    CWD: string;
    ViewEngineName: string;
    HandlerBarsOptions: string;
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
    NajsOptions: {
        port: string;
        host: string;
    };
};
