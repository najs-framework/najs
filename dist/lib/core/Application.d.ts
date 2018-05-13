/// <reference path="../contracts/Application.d.ts" />
import { IAutoload, InstanceCreator, InstanceExtending } from 'najs-binding';
import { Facade } from 'najs-facade';
export declare class Application extends Facade implements Najs.Contracts.Application, IAutoload {
    static className: string;
    getClassName(): string;
    make(className: any): any;
    makeWith<T>(className: any, data: any): T;
    register(classDefinition: any, className?: any, overridable?: any, singleton?: any): this;
    bind(abstract: string, concrete: string | InstanceCreator): this;
    extend(abstract: any, decorator: InstanceExtending): Najs.Contracts.Application;
}
