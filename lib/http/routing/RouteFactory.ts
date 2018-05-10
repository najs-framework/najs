/// <reference path="../../contracts/RouteFactory.ts" />

import { register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { Najs } from '../../constants'
import { RouteCollection } from './RouteCollection'
import { RouteBuilder } from './RouteBuilder'
import { IRouteData } from './interfaces/IRouteData'
import * as PathToRegex from 'path-to-regexp'

export interface RouteFactory extends Najs.Contracts.RouteFactory {}
export class RouteFactory extends Facade {
  static className: string = Najs.Http.RouteFactory

  getClassName() {
    return Najs.Http.RouteFactory
  }

  createByName(name: string): string
  createByName(name: string, param: Object): string
  createByName(name: string, param: Object, options: { encode: (value: string) => string }): string
  createByName(name: string, param?: Object, options?: { encode: (value: string) => string }): string {
    const route: IRouteData = RouteCollection.findOrFail(name)
    const toPath = PathToRegex.compile(route.prefix + route.path)
    return toPath(param, options)
  }

  // redirect(...args: Array<any>): void {}
}

// implements Najs.Contracts.RouteFactory implicitly
const functions = ['use', 'middleware', 'prefix', 'group', 'name', 'method'].concat(RouteBuilder.HttpVerbsSupported)
for (const name of functions) {
  RouteFactory.prototype[name] = function() {
    return RouteCollection.register<RouteBuilder>(new RouteBuilder())[name](...arguments)
  }
}
register(RouteFactory, Najs.Http.RouteFactory)
