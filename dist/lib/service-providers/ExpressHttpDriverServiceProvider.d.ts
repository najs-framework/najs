import { ServiceProvider } from '../core/ServiceProvider';
export declare class ExpressHttpDriverServiceProvider extends ServiceProvider {
    static className: string;
    getClassName(): string;
    register(): Promise<void>;
}
