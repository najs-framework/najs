import { IAutoload } from 'najs-binding';
import * as Session from 'express-session';
export declare class ExpressSessionMemoryStore extends Session.MemoryStore implements IAutoload {
    static className: string;
    getClassName(): string;
}
