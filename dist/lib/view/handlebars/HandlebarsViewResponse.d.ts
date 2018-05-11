import { ViewResponse } from '../../http/response/ViewResponse';
export declare class HandlebarsViewResponse<T extends Object = {}> extends ViewResponse<T> {
    static className: string;
    getClassName(): string;
    helper(name: string, fn: Function): this;
    helper(names: string[], fn: Function): this;
}
