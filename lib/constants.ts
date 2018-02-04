export const HttpDriverClass: string = 'HttpDriver'
export const LoggerClass: string = 'Logger'
export const HttpKernelClass: string = 'HttpKernel'
export const CacheClass: string = 'Cache'

/**
 * This Object Configuration's key
 */
export const ConfigurationKeys = {
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
    options: 'cache.options'
  },
  NajsOptions: {
    port: 'port',
    host: 'host'
  }
}
