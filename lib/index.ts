import './cache/RedisCache'
import './log/WinstonLogger'

// najs-binding package
export { make } from 'najs-binding'
export { bind, InstanceCreator } from 'najs-binding'
export { register } from 'najs-binding'
export { singleton } from 'najs-binding'
export { autoload } from 'najs-binding'
export { extend, InstanceExtending } from 'najs-binding'
export { ClassRegistry } from 'najs-binding'
export { IAutoload, IAutoloadMetadata } from 'najs-binding'

// core package
import { Najs } from './core/Najs'
export { Najs }
export default Najs
export { ServiceProvider } from './core/ServiceProvider'

// constants
export { SystemClass, GlobalFacadeClass, ContextualFacadeClass, ResponseTypeClass } from './constants'

// http package
export { IHttpDriver } from './http/driver/IHttpDriver'
export { HttpDriverStartOptions } from './http/driver/IHttpDriver'
export { HttpKernel } from './http/HttpKernel'

export { RouteCollection } from './http/routing/RouteCollection'
export { ExpressHttpDriver } from './http/driver/ExpressHttpDriver'

export { Controller } from './http/controller/Controller'
export { ExpressController } from './http/controller/ExpressController'

export { RouteFactory } from './http/routing/RouteFactory'

export { ResponseFactory } from './http/response/ResponseFactory'
export { IResponse } from './http/response/IResponse'
export { IResponseFactory } from './http/response/IResponseFactory'
export { ViewResponse } from './http/response/types/ViewResponse'
export { RedirectResponse } from './http/response/types/RedirectResponse'
export { BackResponse } from './http/response/types/BackResponse'
export { JsonResponse } from './http/response/types/JsonResponse'
export { JsonpResponse } from './http/response/types/JsonpResponse'

export { IRequestDataReader } from './http/request/IRequestDataReader'
export { IRequestDataWriter } from './http/request/IRequestDataWriter'
export { RequestInput } from './http/request/RequestInput'
export { RequestDataReader } from './http/request/RequestDataReader'
export { RequestDataWriter } from './http/request/RequestDataWriter'

export { ISession } from './http/session/ISession'
export { Session as NajsSession } from './http/session/Session'
export { ExpressSessionMemoryStore } from './http/session/ExpressSessionMemoryStore'

export { ICookie } from './http/cookie/ICookie'
export { Cookie as NajsCookie } from './http/cookie/Cookie'

export { IMiddleware } from './http/middleware/IMiddleware'
export { IExpressMiddleware } from './http/middleware/IExpressMiddleware'
export { ExpressCsurfMiddleware } from './http/middleware/ExpressCsurfMiddleware'
export { ExpressCorsMiddleware } from './http/middleware/ExpressCorsMiddleware'
export { AuthMiddleware } from './http/middleware/AuthMiddleware'
export { SessionMiddleware } from './http/middleware/SessionMiddleware'
export { CookieMiddleware } from './http/middleware/CookieMiddleware'
export { BodyParserMiddleware } from './http/middleware/BodyParserMiddleware'
export { RequestDataMiddleware } from './http/middleware/RequestDataMiddleware'
export { InputHandlebarsHelperMiddleware } from './http/middleware/InputHandlebarsHelperMiddleware'
export { BodyHandlebarsHelperMiddleware } from './http/middleware/BodyHandlebarsHelperMiddleware'
export { QueryHandlebarsHelperMiddleware } from './http/middleware/QueryHandlebarsHelperMiddleware'
export { ParamsHandlebarsHelperMiddleware } from './http/middleware/ParamsHandlebarsHelperMiddleware'

// najs-facade package
export {
  IFacade,
  IFacadeBase,
  IContextualFacade,
  IContextualFacadeFactory,
  IContextualFacadeFactoryFullVerbs,
  IContextualFacadeVerbAt,
  IContextualFacadeVerbFor,
  IContextualFacadeVerbFrom,
  IContextualFacadeVerbOf,
  IContextualFacadeVerbWith
} from 'najs-facade'
export { IFacadeContainer } from 'najs-facade'
export { Facade } from 'najs-facade'
export { ContextualFacade } from 'najs-facade'
export { FacadeContainer } from 'najs-facade'

// facade package
export { AppFacade, App } from './facades/global/AppFacade'
export { CacheFacade, Cache } from './facades/global/CacheFacade'
export { ConfigFacade, Config } from './facades/global/ConfigFacade'
export { EventFacade, Event } from './facades/global/EventFacade'
export { DispatcherFacade, Dispatcher } from './facades/global/DispatcherFacade'
export { LogFacade, Log } from './facades/global/LogFacade'
export { PathFacade, Path } from './facades/global/PathFacade'
export { RedisFacade, Redis } from './facades/global/RedisFacade'
export { ResponseFacade, Response } from './facades/global/ResponseFacade'
export { RouteFacade, Route } from './facades/global/RouteFacade'

export { InputContextualFacade, Input } from './facades/contextual/InputContextualFacade'
export { SessionContextualFacade, Session } from './facades/contextual/SessionContextualFacade'
export { AuthContextualFacade, Auth } from './facades/contextual/AuthContextualFacade'
export { CookieContextualFacade, Cookie } from './facades/contextual/CookieContextualFacade'

// event package
export { IEventEmitter } from './event/IEventEmitter'
export { IDispatcher } from './event/IDispatcher'
export { EventDispatcher } from './event/EventDispatcher'
export { EventSubscriber } from './event/EventSubscriber'

// cache package
export { ICache, CacheFallback } from './cache/ICache'
export { RedisCache } from './cache/RedisCache'

// test package
export { jest } from './test/jest'
export { TestSuite } from './test/TestSuite'

// log package
export { ILogger } from './log/ILogger'
export { WinstonLogger } from './log/WinstonLogger'

// redis package
export { IRedis } from './redis/IRedis'
export { RedisClient } from './redis/RedisClient'

// helpers package
export { route } from './helpers/route'

// view package
export { HandlebarsHelper } from './view/handlebars/HandlebarsHelper'
export { HandlebarsViewResponse } from './view/handlebars/HandlebarsViewResponse'
export { SessionHandlebarsHelper } from './view/handlebars/helpers/SessionHandlebarsHelper'
export { RequestDataReaderHandlebarsHelper } from './view/handlebars/helpers/RequestDataReaderHandlebarsHelper'
export { CookieHandlebarsHelper } from './view/handlebars/helpers/CookieHandlebarsHelper'

// internal service providers
export { ExpressHttpDriverServiceProvider } from './service-providers/ExpressHttpDriverServiceProvider'
export { HandlebarsViewServiceProvider } from './service-providers/HandlebarsViewServiceProvider'
export { MongooseServiceProvider } from './service-providers/MongooseServiceProvider'

// auth package
export { AuthManager } from './auth/AuthManager'
export { Guard } from './auth/guards/Guard'
export { SessionGuard } from './auth/guards/SessionGuard'
export { GenericUser } from './auth/GenericUser'
export { EloquentUserProvider } from './auth/EloquentUserProvider'
