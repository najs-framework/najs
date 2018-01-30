import { RouteFacade } from '../http/routing/RouteFacade'

export function route(name: string): string
export function route(name: string, param: Object): string
export function route(name: string, param: Object, options: { encode: (value: string) => string }): string
export function route(name: string, param?: any, options?: any): string {
  return (RouteFacade as any).createByName(name, param, options)
}
