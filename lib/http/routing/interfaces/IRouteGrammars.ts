/// <reference path="../../../contracts/types/http.ts" />

/*
 * The purpose of this interface is create a grammar for Route, it affects nothing to implementation side
 * This file has test in ~/syntax/Routing.ts, if something went wrong errors will come out from build phase
 *
 * There are some rules:
 *   - Could not chain HTTP methods after using .group()
 *   - Could not chain group() after using .name()
 *   - Could not chain group() after using .name()
 */
import { HttpMethod } from '../../HttpMethod'
import { Controller } from '../../controller/Controller'

export type RouteGrammarControlChain = IRouteGrammarControl &
  IRouteGrammarGroup &
  IRouteGrammarVerbs &
  IRouteGrammarNamed

export type RouteGrammarControlNoVerbChain = IRouteGrammarControlNoVerb & IRouteGrammarNamedNoVerb

export type RouteGrammarGroupChain = IRouteGrammarControlOnly
export type RouteGrammarVerbChain = IRouteGrammarControlNoVerb & IRouteGrammarNamedNoVerb
export type RouteGrammarNameChain = IRouteGrammarControlOnly & IRouteGrammarVerbs
export type RouteGrammarNameChainNoVerb = IRouteGrammarControlOnly

export interface IRouteGrammarControl {
  use(middleware: string): RouteGrammarControlChain
  use(middleware: Najs.Http.IMiddleware): RouteGrammarControlChain
  use(middleware: Function): RouteGrammarControlChain
  use(middleware: string[]): RouteGrammarControlChain
  use(middleware: Najs.Http.IMiddleware[]): RouteGrammarControlChain
  use(middleware: Function[]): RouteGrammarControlChain
  use(
    ...middleware: Array<string | string[] | Najs.Http.IMiddleware | Najs.Http.IMiddleware[] | Function | Function[]>
  ): RouteGrammarControlChain

  middleware(middleware: string): RouteGrammarControlChain
  middleware(middleware: Najs.Http.IMiddleware): RouteGrammarControlChain
  middleware(middleware: Function): RouteGrammarControlChain
  middleware(middleware: string[]): RouteGrammarControlChain
  middleware(middleware: Najs.Http.IMiddleware[]): RouteGrammarControlChain
  middleware(middleware: Function[]): RouteGrammarControlChain
  middleware(
    ...middleware: Array<string | string[] | Najs.Http.IMiddleware | Najs.Http.IMiddleware[] | Function | Function[]>
  ): RouteGrammarControlChain

  prefix(prefix: string): RouteGrammarControlChain
}

export interface IRouteGrammarControlNoVerb {
  use(middleware: string): RouteGrammarControlNoVerbChain
  use(middleware: Najs.Http.IMiddleware): RouteGrammarControlNoVerbChain
  use(middleware: Function): RouteGrammarControlNoVerbChain
  use(middleware: string[]): RouteGrammarControlNoVerbChain
  use(middleware: Najs.Http.IMiddleware[]): RouteGrammarControlNoVerbChain
  use(middleware: Function[]): RouteGrammarControlNoVerbChain
  use(
    ...middleware: Array<string | string[] | Najs.Http.IMiddleware | Najs.Http.IMiddleware[] | Function | Function[]>
  ): RouteGrammarControlNoVerbChain

  middleware(middleware: string): RouteGrammarControlNoVerbChain
  middleware(middleware: Najs.Http.IMiddleware): RouteGrammarControlNoVerbChain
  middleware(middleware: Function): RouteGrammarControlNoVerbChain
  middleware(middleware: string[]): RouteGrammarControlNoVerbChain
  middleware(middleware: Najs.Http.IMiddleware[]): RouteGrammarControlNoVerbChain
  middleware(middleware: Function[]): RouteGrammarControlNoVerbChain
  middleware(
    ...middleware: Array<string | string[] | Najs.Http.IMiddleware | Najs.Http.IMiddleware[] | Function | Function[]>
  ): RouteGrammarControlNoVerbChain

  prefix(prefix: string): RouteGrammarControlNoVerbChain
}

export interface IRouteGrammarControlOnly {
  use(middleware: string): IRouteGrammarControlOnly
  use(middleware: Najs.Http.IMiddleware): IRouteGrammarControlOnly
  use(middleware: Function): IRouteGrammarControlOnly
  use(middleware: string[]): IRouteGrammarControlOnly
  use(middleware: Najs.Http.IMiddleware[]): IRouteGrammarControlOnly
  use(middleware: Function[]): IRouteGrammarControlOnly
  use(
    ...middleware: Array<string | string[] | Najs.Http.IMiddleware | Najs.Http.IMiddleware[] | Function | Function[]>
  ): IRouteGrammarControlOnly

  middleware(middleware: string): IRouteGrammarControlOnly
  middleware(middleware: Najs.Http.IMiddleware): IRouteGrammarControlOnly
  middleware(middleware: Function): IRouteGrammarControlOnly
  middleware(middleware: string[]): IRouteGrammarControlOnly
  middleware(middleware: Najs.Http.IMiddleware[]): IRouteGrammarControlOnly
  middleware(middleware: Function[]): IRouteGrammarControlOnly
  middleware(
    ...middleware: Array<string | string[] | Najs.Http.IMiddleware | Najs.Http.IMiddleware[] | Function | Function[]>
  ): IRouteGrammarControlOnly

  prefix(prefix: string): IRouteGrammarControlOnly
}

export interface IRouteGrammarGroup {
  group(callback: () => void): RouteGrammarGroupChain
}

export interface IRouteGrammarVerbs {
  method(method: HttpMethod | 'all', path: string, target: string): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, endpoint: Function): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  all(path: string, target: string): RouteGrammarVerbChain
  all(path: string, endpoint: Function): RouteGrammarVerbChain
  all(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  all(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  checkout(path: string, target: string): RouteGrammarVerbChain
  checkout(path: string, endpoint: Function): RouteGrammarVerbChain
  checkout(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  checkout(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  copy(path: string, target: string): RouteGrammarVerbChain
  copy(path: string, endpoint: Function): RouteGrammarVerbChain
  copy(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  copy(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  delete(path: string, target: string): RouteGrammarVerbChain
  delete(path: string, endpoint: Function): RouteGrammarVerbChain
  delete(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  delete(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  get(path: string, target: string): RouteGrammarVerbChain
  get(path: string, endpoint: Function): RouteGrammarVerbChain
  get(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  get(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  head(path: string, target: string): RouteGrammarVerbChain
  head(path: string, endpoint: Function): RouteGrammarVerbChain
  head(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  head(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  lock(path: string, target: string): RouteGrammarVerbChain
  lock(path: string, endpoint: Function): RouteGrammarVerbChain
  lock(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  lock(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  merge(path: string, target: string): RouteGrammarVerbChain
  merge(path: string, endpoint: Function): RouteGrammarVerbChain
  merge(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  merge(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  mkactivity(path: string, target: string): RouteGrammarVerbChain
  mkactivity(path: string, endpoint: Function): RouteGrammarVerbChain
  mkactivity(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  mkactivity(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  mkcol(path: string, target: string): RouteGrammarVerbChain
  mkcol(path: string, endpoint: Function): RouteGrammarVerbChain
  mkcol(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  mkcol(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  move(path: string, target: string): RouteGrammarVerbChain
  move(path: string, endpoint: Function): RouteGrammarVerbChain
  move(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  move(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  msearch(path: string, target: string): RouteGrammarVerbChain
  msearch(path: string, endpoint: Function): RouteGrammarVerbChain
  msearch(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  msearch(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  notify(path: string, target: string): RouteGrammarVerbChain
  notify(path: string, endpoint: Function): RouteGrammarVerbChain
  notify(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  notify(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  options(path: string, target: string): RouteGrammarVerbChain
  options(path: string, endpoint: Function): RouteGrammarVerbChain
  options(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  options(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  patch(path: string, target: string): RouteGrammarVerbChain
  patch(path: string, endpoint: Function): RouteGrammarVerbChain
  patch(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  patch(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  post(path: string, target: string): RouteGrammarVerbChain
  post(path: string, endpoint: Function): RouteGrammarVerbChain
  post(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  post(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  purge(path: string, target: string): RouteGrammarVerbChain
  purge(path: string, endpoint: Function): RouteGrammarVerbChain
  purge(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  purge(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  put(path: string, target: string): RouteGrammarVerbChain
  put(path: string, endpoint: Function): RouteGrammarVerbChain
  put(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  put(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  report(path: string, target: string): RouteGrammarVerbChain
  report(path: string, endpoint: Function): RouteGrammarVerbChain
  report(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  report(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  search(path: string, target: string): RouteGrammarVerbChain
  search(path: string, endpoint: Function): RouteGrammarVerbChain
  search(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  search(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  subscribe(path: string, target: string): RouteGrammarVerbChain
  subscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  subscribe(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  subscribe(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  trace(path: string, target: string): RouteGrammarVerbChain
  trace(path: string, endpoint: Function): RouteGrammarVerbChain
  trace(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  trace(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  unlock(path: string, target: string): RouteGrammarVerbChain
  unlock(path: string, endpoint: Function): RouteGrammarVerbChain
  unlock(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  unlock(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain

  unsubscribe(path: string, target: string): RouteGrammarVerbChain
  unsubscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  unsubscribe(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  unsubscribe(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
}

export interface IRouteGrammarNamed {
  name(name: string): RouteGrammarNameChain
}

export interface IRouteGrammarNamedNoVerb {
  name(name: string): RouteGrammarNameChainNoVerb
}
