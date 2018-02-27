import { ViewResponse } from '../../http/response/types/ViewResponse';
export declare class HandlebarsViewResponse<T extends Object = {}> extends ViewResponse {
    static className: string;
    constructor(view: string);
    constructor(view: string, variables: T);
    getClassName(): string;
    helper(name: string, fn: Function): void;
}
