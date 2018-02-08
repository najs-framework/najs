import { InstanceCreator } from './bind';
import { IConfig } from '../config/IConfig';
import { AppOptions, AppPath, IApplication } from './IApplication';
export declare class Application implements IApplication {
    config: IConfig;
    private options;
    use(options: Partial<AppOptions>): this;
    make<T>(classDefinition: any): T;
    make<T>(className: string): T;
    make<T>(className: string, data: Object): T;
    register<T>(classDefinition: T): this;
    register<T>(classDefinition: T, className: string): this;
    register<T>(classDefinition: T, className: string, overridable: boolean): this;
    register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): this;
    bind(className: string, instanceCreator: InstanceCreator): this;
    bind(className: string, concrete: string): this;
    path(): string;
    path(...args: string[]): string;
    path(type: AppPath, ...args: string[]): string;
    start(): void;
    start(options: Partial<AppOptions>): void;
}
