export const SchemaValidatorClass: string = 'SchemaValidator'

export const SystemClass = {
  HttpKernel: 'Najs.HttpKernel',
  HttpDriver: 'Najs.HttpDriver'
}

export const GlobalFacade = {
  Application: 'Najs.Application',
  Cache: 'Najs.Cache',
  Config: 'Najs.Config',
  Event: 'Najs.EventDispatcher',
  Log: 'Najs.Log',
  Path: 'Najs.Path'
}

/**
 * This Object Configuration's key
 */
export const ConfigurationKeys = {
  Port: 'port',
  Host: 'host',
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
  }
}
