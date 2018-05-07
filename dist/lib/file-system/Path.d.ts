/// <reference path="../contracts/Path.d.ts" />
import { IAutoload } from 'najs-binding';
import { Facade } from 'najs-facade';
export interface Path extends Najs.Contracts.Path {
}
export declare class Path extends Facade implements IAutoload {
    static className: string;
    getClassName(): string;
    get(...args: string[]): string;
    cwd(...args: string[]): string;
}
