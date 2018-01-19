export interface IRouteData {
    metadata?: Object;
    name: string;
    method: string;
    path: string;
    prefix: string;
    controller: string;
    endpoint: string | any;
    middleware: Array<string>;
}
