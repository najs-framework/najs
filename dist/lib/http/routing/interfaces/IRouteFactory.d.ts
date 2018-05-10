/// <reference path="../../../contracts/types/routing.d.ts" />
export interface IRouteFactory extends Najs.Http.Routing.Verbs, Najs.Http.Routing.Control {
    group(callback: () => void): Najs.Http.Routing.GroupChain;
    name(name: string): Najs.Http.Routing.NameChain;
}
