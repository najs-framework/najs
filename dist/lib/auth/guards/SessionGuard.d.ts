import { Guard } from './Guard';
import { IAuthenticatable } from '../interfaces/IAuthenticatable';
export declare class SessionGuard extends Guard {
    protected getSessionKey(): string;
    hasUser(): boolean;
    hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean;
    retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined>;
    attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void>;
    detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void>;
}
