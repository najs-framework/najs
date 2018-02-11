import { IApplication } from './IApplication';
import { IAutoload } from './IAutoload';
export declare abstract class ServiceProvider implements IAutoload {
    abstract getClassName(): string;
    protected app: IApplication;
    constructor(app: IApplication);
    register(): Promise<void>;
    boot(): Promise<void>;
}
