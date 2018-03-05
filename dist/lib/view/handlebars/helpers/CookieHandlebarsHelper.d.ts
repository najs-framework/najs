import { IAutoload } from 'najs-binding';
import { HandlebarsHelper } from '../HandlebarsHelper';
import { ExpressController } from '../../../http/controller/ExpressController';
export declare class CookieHandlebarsHelper extends HandlebarsHelper<any, ExpressController> implements IAutoload {
    static className: string;
    getClassName(): string;
    protected isValid(): boolean;
    protected handleBlockHelper(key: string): any;
    protected handleHelper(command: string, ...args: any[]): string;
    run(command: string, ...args: any[]): undefined | boolean | string;
}
