/// <reference path="http.ts" />

namespace Najs.Http.Routing {
  /*
   * The purpose of these interfaces is create a grammar for Route, it affects nothing to implementation side
   * This file has test in ~/syntax/Routing.ts, if something went wrong errors will come out from build phase
   *
   * There are some rules:
   *   - Could not chain HTTP methods after using .group()
   *   - Could not chain group() after using .name()
   *   - Could not chain group() after using .name()
   */

  export type ControlChain = Control & Group & Verbs & Named
  export type ControlNoVerbChain = ControlNoVerb & NamedNoVerb
  export type GroupChain = ControlOnly
  export type VerbChain = ControlNoVerb & NamedNoVerb
  export type NameChain = ControlOnly & Verbs
  export type NameChainNoVerb = ControlOnly

  export interface Control {
    use(...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>): ControlChain

    middleware(
      ...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>
    ): ControlChain

    prefix(prefix: string): ControlChain
  }

  export interface ControlNoVerb {
    use(
      ...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>
    ): ControlNoVerbChain

    middleware(
      ...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>
    ): ControlNoVerbChain

    prefix(prefix: string): ControlNoVerbChain
  }

  export interface ControlOnly {
    use(...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>): ControlOnly

    middleware(
      ...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>
    ): ControlOnly

    prefix(prefix: string): ControlOnly
  }

  export interface Group {
    group(callback: () => void): GroupChain
  }

  export interface Named {
    name(name: string): NameChain
  }

  export interface NamedNoVerb {
    name(name: string): NameChainNoVerb
  }

  export interface Verbs {
    method(method: HttpMethod | 'all', path: string, target: string): VerbChain
    method(method: HttpMethod | 'all', path: string, endpoint: Function): VerbChain
    method(method: HttpMethod | 'all', path: string, controller: IController<any, any>, endpoint: string): VerbChain
    method<T, K extends keyof T>(
      method: HttpMethod | 'all',
      path: string,
      controller: T | { new (): T },
      endpoint: K
    ): VerbChain

    all(path: string, target: string): VerbChain
    all(path: string, endpoint: Function): VerbChain
    all(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    all<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    checkout(path: string, target: string): VerbChain
    checkout(path: string, endpoint: Function): VerbChain
    checkout(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    checkout<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    copy(path: string, target: string): VerbChain
    copy(path: string, endpoint: Function): VerbChain
    copy(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    copy<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    delete(path: string, target: string): VerbChain
    delete(path: string, endpoint: Function): VerbChain
    delete(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    delete<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    get(path: string, target: string): VerbChain
    get(path: string, endpoint: Function): VerbChain
    get(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    get<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    head(path: string, target: string): VerbChain
    head(path: string, endpoint: Function): VerbChain
    head(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    head<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    lock(path: string, target: string): VerbChain
    lock(path: string, endpoint: Function): VerbChain
    lock(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    lock<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    merge(path: string, target: string): VerbChain
    merge(path: string, endpoint: Function): VerbChain
    merge(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    merge<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    mkactivity(path: string, target: string): VerbChain
    mkactivity(path: string, endpoint: Function): VerbChain
    mkactivity(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    mkactivity<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    mkcol(path: string, target: string): VerbChain
    mkcol(path: string, endpoint: Function): VerbChain
    mkcol(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    mkcol<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    move(path: string, target: string): VerbChain
    move(path: string, endpoint: Function): VerbChain
    move(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    move<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    msearch(path: string, target: string): VerbChain
    msearch(path: string, endpoint: Function): VerbChain
    msearch(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    msearch<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    notify(path: string, target: string): VerbChain
    notify(path: string, endpoint: Function): VerbChain
    notify(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    notify<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    options(path: string, target: string): VerbChain
    options(path: string, endpoint: Function): VerbChain
    options(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    options<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    patch(path: string, target: string): VerbChain
    patch(path: string, endpoint: Function): VerbChain
    patch(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    patch<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    post(path: string, target: string): VerbChain
    post(path: string, endpoint: Function): VerbChain
    post(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    post<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    purge(path: string, target: string): VerbChain
    purge(path: string, endpoint: Function): VerbChain
    purge(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    purge<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    put(path: string, target: string): VerbChain
    put(path: string, endpoint: Function): VerbChain
    put(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    put<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    report(path: string, target: string): VerbChain
    report(path: string, endpoint: Function): VerbChain
    report(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    report<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    search(path: string, target: string): VerbChain
    search(path: string, endpoint: Function): VerbChain
    search(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    search<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    subscribe(path: string, target: string): VerbChain
    subscribe(path: string, endpoint: Function): VerbChain
    subscribe(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    subscribe<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    trace(path: string, target: string): VerbChain
    trace(path: string, endpoint: Function): VerbChain
    trace(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    trace<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    unlock(path: string, target: string): VerbChain
    unlock(path: string, endpoint: Function): VerbChain
    unlock(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    unlock<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain

    unsubscribe(path: string, target: string): VerbChain
    unsubscribe(path: string, endpoint: Function): VerbChain
    unsubscribe(path: string, controller: IController<any, any>, endpoint: string): VerbChain
    unsubscribe<T, K extends keyof T>(path: string, controller: T | { new (): T }, endpoint: K): VerbChain
  }
}
