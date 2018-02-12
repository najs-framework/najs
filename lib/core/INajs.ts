import { HttpDriverStartOptions } from '../http/driver/IHttpDriver'
import { ServiceProvider } from './ServiceProvider'

export interface INajs {
  workingDirectory(cwd: string): this

  classes(autoload: string): this
  classes(...args: string[]): this

  providers(providers: string[]): this
  providers(providers: Array<typeof ServiceProvider>): this

  on(event: 'crash', listener: (error: Error) => void): this
  on(event: 'crashed', listener: (error: Error) => void): this
  on(event: 'start', listener: (najs: INajs) => void): this
  on(event: 'started', listener: (najs: INajs) => void): this
  on(event: 'registered', listener: (najs: INajs, classProvider: ServiceProvider) => void): this
  on(event: 'booted', listener: (najs: INajs, classProvider: ServiceProvider) => void): this

  start(): Promise<void>
  start(options: HttpDriverStartOptions): Promise<void>
}
