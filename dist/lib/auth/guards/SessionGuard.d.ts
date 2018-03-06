import { Guard } from './Guard';
import { IAuthenticatable } from '../interfaces/IAuthenticatable';
export declare type RememberData = {
    id: any;
    token: string;
};
export declare class SessionGuard extends Guard {
    protected getRememberData(): RememberData;
    protected getSessionKey(): string;
    protected getCookieKey(): string;
    hasUser(): boolean;
    hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean;
    retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined>;
    attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void>;
    detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void>;
}
