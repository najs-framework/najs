/// <reference path="../contracts/Config.d.ts" />
import { Facade } from 'najs-facade';
import * as ConfigLib from 'config';
export declare class Config extends Facade implements Najs.Contracts.Config {
    static className: string;
    protected config: ConfigLib.IConfig;
    getClassName(): string;
    get<T>(name: string, defaultValue?: T): T | undefined;
    has(setting: string): boolean;
}
