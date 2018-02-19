import { IAutoload } from './IAutoload';
import { InstanceCreator } from './bind';
import { IApplication } from './IApplication';
import { Facade } from '../facades/Facade';
export declare class Application extends Facade implements IApplication, IAutoload {
    static className: string;
    getClassName(): string;
    make<T>(classDefinition: any): T;
    make<T>(className: string): T;
    makeWith<T>(classDefinition: any, data: Object): T;
    makeWith<T>(className: string, data: Object): T;
    makeWith<T>(classDefinition: string, data: any[]): T;
    makeWith<T>(className: string, data: any[]): T;
    register<T>(classDefinition: T): this;
    register<T>(classDefinition: T, className: string): this;
    register<T>(classDefinition: T, className: string, overridable: boolean): this;
    register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): this;
    bind(className: string, instanceCreator: InstanceCreator): this;
    bind(className: string, concrete: string): this;
}
