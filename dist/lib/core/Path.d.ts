import { IAutoload } from 'najs-binding';
import { Facade } from '../facades/Facade';
import { IPath } from './IPath';
export declare class Path extends Facade implements IPath, IAutoload {
    static className: string;
    getClassName(): string;
    get(...args: string[]): string;
    cwd(...args: string[]): string;
    app(...args: string[]): string;
    config(...args: string[]): string;
    layout(...args: string[]): string;
    public(...args: string[]): string;
    resource(...args: string[]): string;
    route(...args: string[]): string;
    storage(...args: string[]): string;
    view(...args: string[]): string;
}
