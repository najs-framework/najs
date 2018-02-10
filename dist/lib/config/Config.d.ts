import { Facade } from '../facades/Facade';
import { IConfig } from './IConfig';
import * as ConfigLib from 'config';
export declare class Config extends Facade implements IConfig {
    protected config: ConfigLib.IConfig;
    get<T>(setting: string): T | undefined;
    get<T>(setting: string, defaultValue: T): T;
    has(setting: string): boolean;
}
