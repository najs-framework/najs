import { IAutoload } from 'najs-binding';
import { HandlebarsHelper } from '../HandlebarsHelper';
import { ExpressController } from '../../../http/controller/ExpressController';
export declare class SessionHandlebarsHelper extends HandlebarsHelper<any, ExpressController> implements IAutoload {
    static className: string;
    getClassName(): string;
    run(command: string, ...args: any[]): undefined | boolean | string;
}
