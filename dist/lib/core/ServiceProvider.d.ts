import { IApplication } from './IApplication';
import { IAutoload } from './IAutoload';
export declare abstract class ServiceProvider implements IAutoload {
    abstract getClassName(): string;
    protected app: IApplication;
    constructor(application: IApplication);
    register(): void;
    boot(): void;
}
