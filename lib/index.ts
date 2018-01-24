import './log/WinstonLogger'
import { Najs } from './core/Najs'

export default Najs

export { make } from './core/make'
export { bind } from './core/bind'
export { register } from './core/register'
export { singleton } from './core/singleton'
export { autoload } from './core/autoload'
export { ClassRegistry } from './core/ClassRegistry'
export { IAutoload } from './core/IAutoload'

export { Route } from './http/routing/Route'
export { RouteCollection } from './http/routing/RouteCollection'
export { ExpressHttpDriver } from './http/driver/ExpressHttpDriver'

export { ILogger } from './log/ILogger'
export { Log } from './log/Log'
export { WinstonLogger } from './log/WinstonLogger'

export { LoggerClass } from './constants'
