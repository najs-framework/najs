import { InstanceCreator } from './bind';
import { IConfig } from 'config';
export declare type NajsOptions = {
    port: number;
    host?: string;
};
export declare class Najs {
    private static config;
    private static options;
    static use(config: IConfig): typeof Najs;
    static use(options: Partial<NajsOptions>): typeof Najs;
    static make<T>(classDefinition: any): T;
    static make<T>(className: string): T;
    static make<T>(className: string, data: Object): T;
    static register<T>(classDefinition: T): typeof Najs;
    static register<T>(classDefinition: T, className: string): typeof Najs;
    static register<T>(classDefinition: T, className: string, overridable: boolean): typeof Najs;
    static register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): typeof Najs;
    static bind(className: string, instanceCreator: InstanceCreator): typeof Najs;
    static bind(className: string, concrete: string): typeof Najs;
    static hasConfig(setting: string): boolean;
    static getConfig<T>(setting: string): T;
    static getConfig<T>(setting: string, defaultValue: T): T;
    static start(): void;
    static start(options: Partial<NajsOptions>): void;
    static start(config: IConfig): void;
}
