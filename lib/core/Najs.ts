import { make } from './make'
import { register } from './register'
import { IHttpDriver } from '../http/IHttpDriver'

export type NajsOptions = {
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

  static use(options: Partial<NajsOptions> | undefined): typeof Najs {
    this.options = Object.assign({}, NajsDefaultOptions, options)
    return Najs
  }

  static make<T>(classDefinition: any): T
  static make<T>(className: string): T
  static make<T>(className: string, data: Object): T
  static make(className: any, data?: any): any {
    return make(className, data)
  }

  static register<T>(classDefinition: T): typeof Najs
  static register<T>(classDefinition: T, className: string): typeof Najs
  static register<T>(classDefinition: T, className: string, overridable: boolean): typeof Najs
  static register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): typeof Najs
  static register(classDefinition: any, className?: any, overridable?: any, singleton?: any): typeof Najs {
    register(classDefinition, className, overridable, singleton)
    return this
  }

  // static loadClasses(classes: Array<any>): typeof Najs
  // static loadClasses(classes: Object): typeof Najs
  // static loadClasses(classes: Object | Array<any>): typeof Najs {
  //   return this
  // }

  static start(): void
  static start(options: Partial<NajsOptions>): void
  static start(options?: Partial<NajsOptions>): void {
    if (options) {
      this.use(options)
    }
    const httpDriver: IHttpDriver = make(this.options.httpDriver)
    httpDriver.start(this.options)
  }
}
