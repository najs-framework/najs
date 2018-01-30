export interface IRouteGenerateUrl {
  createByName(name: string): string
  createByName(name: string, param: Object): string
  createByName(name: string, param: Object, options: { encode: (value: string) => string }): string
}
