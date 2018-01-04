import { IAutoload } from '../index';
export declare abstract class Controller implements IAutoload {
    abstract getClassName(): string;
    getDefaultRequestParser(): void;
    getDefaultResponseHandler(): void;
}
