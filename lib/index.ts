import './cache/RedisCache'
import './log/WinstonLogger'

// core package
import { Najs } from './core/Najs'
export { Najs }
export default Najs

export { make } from './core/make'
export { bind } from './core/bind'
export { register } from './core/register'
export { singleton } from './core/singleton'
export { autoload } from './core/autoload'
export { ClassRegistry } from './core/ClassRegistry'
export { IAutoload } from './core/IAutoload'

// http package
export { IHttpDriver } from './http/driver/IHttpDriver'
export { HttpDriverStartOptions } from './http/driver/IHttpDriver'
export { HttpKernel } from './http/HttpKernel'

export { RouteFacade as Route } from './http/routing/RouteFacade'
export { RouteCollection } from './http/routing/RouteCollection'
export { ExpressHttpDriver } from './http/driver/ExpressHttpDriver'

export { Controller } from './http/controller/Controller'
export { ExpressController } from './http/controller/ExpressController'

export { ResponseFacade as Response } from './http/response/ResponseFacade'
export { IResponse } from './http/response/IResponse'
export { IResponseFacade } from './http/response/IResponseFacade'
export { ViewResponse } from './http/response/types/ViewResponse'
export { RedirectResponse } from './http/response/types/RedirectResponse'
export { JsonResponse } from './http/response/types/JsonResponse'
export { JsonpResponse } from './http/response/types/JsonpResponse'

export { IRequestRetriever } from './http/request/IRequestRetriever'
export { RequestData } from './http/request/RequestData'

export { IMiddleware } from './http/middleware/IMiddleware'
export { IExpressMiddleware } from './http/middleware/IExpressMiddleware'
export { ExpressCsurfMiddleware } from './http/middleware/ExpressCsurfMiddleware'
export { ExpressCorsMiddleware } from './http/middleware/ExpressCorsMiddleware'

// facade package
export { AppFacade as App } from './facades/global/AppFacade'
export { CacheFacade as Cache } from './facades/global/CacheFacade'
export { ConfigFacade as Config } from './facades/global/ConfigFacade'
export { PathFacade as Path } from './facades/global/PathFacade'

// cache package
export { ICache, CacheFallback } from './cache/ICache'
export { RedisCache } from './cache/RedisCache'

// log package
export { ILogger } from './log/ILogger'
export { Log, reload as reloadLog } from './log/Log'
export { WinstonLogger } from './log/WinstonLogger'

export { LoggerClass } from './constants'
export { HttpDriverClass } from './constants'

// helpers package
export { route } from './helpers/route'
