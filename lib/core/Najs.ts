import { make } from './make'
import { register } from './register'
import { IHttpDriver } from '../http/IHttpDriver'

type NajsOptions = {
  port: number
  host: string
  httpDriver: string
}

const NajsDefaultOptions: NajsOptions = {
  port: 3000,
  host: 'localhost',
  httpDriver: 'ExpressHttpDriver'
}

export class Najs {
  private static options: NajsOptions = NajsDefaultOptions

  static use(options: Partial<NajsOptions>): typeof Najs {
    this.options = Object.assign({}, options, NajsDefaultOptions)
    return Najs
  }

  static make<T>(classDefinition: any): T
  static make<T>(className: string): T
  static make<T>(className: string, data: Object): T
  static make(className: string): any {
    return make(className)
  }

  static register<T>(classDefinition: T): typeof Najs
  static register<T>(classDefinition: T, className: string): typeof Najs
  static register<T>(classDefinition: T, className: string, overridable: boolean): typeof Najs
  static register(classDefinition: any, className?: any, overridable?: any): typeof Najs {
    register(classDefinition, className, overridable)
    return this
  }

  static loadClasses(classes: Array<any>): typeof Najs
  static loadClasses(classes: Object): typeof Najs
  static loadClasses(classes: Object | Array<any>): typeof Najs {
    return this
  }

  static remap(data: Object): typeof Najs
  static remap(target: string, destination: string): typeof Najs
  static remap(target: any, destination?: any): typeof Najs {
    return this
  }

  static start(options?: Partial<NajsOptions>) {
    if (options) {
      this.use(options)
    }
    const httpDriver: IHttpDriver = make(this.options.httpDriver)
    httpDriver.start(this.options)
  }
}
