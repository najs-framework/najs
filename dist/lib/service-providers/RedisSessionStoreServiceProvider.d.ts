import { ServiceProvider } from '../core/ServiceProvider';
export declare class RedisSessionStoreServiceProvider extends ServiceProvider {
    static className: string;
    getClassName(): string;
    register(): Promise<void>;
}
