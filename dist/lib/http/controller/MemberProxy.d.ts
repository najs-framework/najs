import { IAutoload } from 'najs-binding';
export declare type MemberProxySetting = {
    chainable?: string[];
    returnUndefined?: string[];
    returnTrue?: string[];
    returnFalse?: string[];
    returnEmptyObject?: string[];
    returnPromiseUndefined?: string[];
    [key: string]: any;
};
export declare class MemberProxy implements IAutoload {
    static className: string;
    protected message: string;
    protected members: string[];
    protected settings: MemberProxySetting;
    protected proxy: any;
    constructor(message: string, settings: MemberProxySetting);
    getClassName(): string;
    protected createProxy(): MemberProxy;
}
