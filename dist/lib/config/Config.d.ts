import { Facade } from '../facades/Facade';
import { IConfig } from './IConfig';
import * as ConfigLib from 'config';
import { IAutoload } from 'najs-binding';
export declare class Config extends Facade implements IConfig, IAutoload {
    static className: string;
    protected config: ConfigLib.IConfig;
    getClassName(): string;
    get<T>(setting: string): T | undefined;
    get<T>(setting: string, defaultValue: T): T;
    has(setting: string): boolean;
}
