import { AppOptions, IApplication } from './IApplication';
import { ServiceProvider } from './ServiceProvider';
export interface INajs {
    rootPath: string;
    app: IApplication;
    cwd(cwd: string): this;
    providers(providers: ServiceProvider[]): this;
    start(): void;
    start(options: Partial<AppOptions>): void;
}
export declare const Najs: INajs;
