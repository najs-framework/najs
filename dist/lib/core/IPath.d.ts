import { IAutoload } from 'najs-binding';
export interface IPath extends IAutoload {
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
