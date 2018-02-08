import { IConfig } from 'config';
import { InstanceCreator } from '../../core/bind';
export declare type NajsOptions = {
    port: number;
    host?: string;
};
export declare enum AppPath {
    App = "app",
    Base = "base",
    Config = "config",
    Layout = "layout",
    Public = "public",
    Resource = "resource",
    Route = "route",
    Storage = "storage",
    View = "view",
}
export interface IAppFacade {
    use(config: IConfig): IAppFacade;
    use(options: Partial<NajsOptions>): IAppFacade;
    make<T>(classDefinition: any): T;
    make<T>(className: string): T;
    make<T>(className: string, data: Object): T;
    register<T>(classDefinition: T): IAppFacade;
    register<T>(classDefinition: T, className: string): IAppFacade;
    register<T>(classDefinition: T, className: string, overridable: boolean): IAppFacade;
    register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): IAppFacade;
    bind(className: string, instanceCreator: InstanceCreator): IAppFacade;
    bind(className: string, concrete: string): IAppFacade;
    path(): string;
    path(...args: string[]): string;
    path(type: AppPath, ...args: string[]): string;
}
