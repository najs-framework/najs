import { IApplication } from './IApplication';
import { IAutoload } from './IAutoload';
export declare abstract class ServiceProvider implements IAutoload {
    abstract getClassName(): string;
    protected setFacadeRoot: (name: string, instance: any) => void;
    protected app: IApplication;
    private constructor();
    register(): Promise<void>;
    boot(): Promise<void>;
}
