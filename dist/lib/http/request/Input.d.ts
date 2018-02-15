import { ExpressController } from '../controller/ExpressController';
import { ContextualFacade } from '../../facades/ContextualFacade';
import { IRequestRetriever } from './IRequestRetriever';
import { HttpMethod } from '../HttpMethod';
export declare class Input extends ContextualFacade<ExpressController> implements IRequestRetriever {
    protected data: Object;
    readonly body: Object;
    readonly query: Object;
    readonly params: Object;
    readonly method: HttpMethod;
    constructor(controller: ExpressController);
    protected buildData(): void;
    setData(data: Object): void;
    get<T extends any>(name: string): T;
    get<T extends any>(name: string, defaultValue: T): T;
    has(name: string): boolean;
    all(): Object;
    only(name: string): Object;
    only(names: string[]): Object;
    only(...args: Array<string | string[]>): Object;
    except(name: string): Object;
    except(names: string[]): Object;
    except(...args: Array<string | string[]>): Object;
}
