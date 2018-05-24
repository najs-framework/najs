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
    method<T extends IController, K extends keyof T>(
      method: HttpMethod | 'all',
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    all(path: string, target: string): VerbChain
    all(path: string, endpoint: Function): VerbChain
    all<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    checkout(path: string, target: string): VerbChain
    checkout(path: string, endpoint: Function): VerbChain
    checkout<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    copy(path: string, target: string): VerbChain
    copy(path: string, endpoint: Function): VerbChain
    copy<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    delete(path: string, target: string): VerbChain
    delete(path: string, endpoint: Function): VerbChain
    delete<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    get(path: string, target: string): VerbChain
    get(path: string, endpoint: Function): VerbChain
    get<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    head(path: string, target: string): VerbChain
    head(path: string, endpoint: Function): VerbChain
    head<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    lock(path: string, target: string): VerbChain
    lock(path: string, endpoint: Function): VerbChain
    lock<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    merge(path: string, target: string): VerbChain
    merge(path: string, endpoint: Function): VerbChain
    merge<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    mkactivity(path: string, target: string): VerbChain
    mkactivity(path: string, endpoint: Function): VerbChain
    mkactivity<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    mkcol(path: string, target: string): VerbChain
    mkcol(path: string, endpoint: Function): VerbChain
    mkcol<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    move(path: string, target: string): VerbChain
    move(path: string, endpoint: Function): VerbChain
    move<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    msearch(path: string, target: string): VerbChain
    msearch(path: string, endpoint: Function): VerbChain
    msearch<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    notify(path: string, target: string): VerbChain
    notify(path: string, endpoint: Function): VerbChain
    notify<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    options(path: string, target: string): VerbChain
    options(path: string, endpoint: Function): VerbChain
    options<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    patch(path: string, target: string): VerbChain
    patch(path: string, endpoint: Function): VerbChain
    patch<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    post(path: string, target: string): VerbChain
    post(path: string, endpoint: Function): VerbChain
    post<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    purge(path: string, target: string): VerbChain
    purge(path: string, endpoint: Function): VerbChain
    purge<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    put(path: string, target: string): VerbChain
    put(path: string, endpoint: Function): VerbChain
    put<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    report(path: string, target: string): VerbChain
    report(path: string, endpoint: Function): VerbChain
    report<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    search(path: string, target: string): VerbChain
    search(path: string, endpoint: Function): VerbChain
    search<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    subscribe(path: string, target: string): VerbChain
    subscribe(path: string, endpoint: Function): VerbChain
    subscribe<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    trace(path: string, target: string): VerbChain
    trace(path: string, endpoint: Function): VerbChain
    trace<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    unlock(path: string, target: string): VerbChain
    unlock(path: string, endpoint: Function): VerbChain
    unlock<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain

    unsubscribe(path: string, target: string): VerbChain
    unsubscribe(path: string, endpoint: Function): VerbChain
    unsubscribe<T extends IController, K extends keyof T>(
      path: string,
      controller: T | { new (...args: any[]): T },
      endpoint: K
    ): VerbChain
  }
}
