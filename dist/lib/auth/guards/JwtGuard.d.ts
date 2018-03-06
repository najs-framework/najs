import { Guard } from './Guard';
import { IAuthenticatable } from '../interfaces/IAuthenticatable';
export declare type JwtGuardOptions = {
    secret: string;
    expireInMinute: number;
    encrypt: boolean;
    encryptPassword: string;
    encryptAlgorithm: string;
    encryptedPrefix: string;
};
export declare class JwtGuard extends Guard {
    protected options: JwtGuardOptions;
    protected initialize(): void;
    protected getToken(): string;
    protected encryptToken(token: string): string;
    protected decryptToken(input: string): string;
    hasUser(): boolean;
    hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean;
    retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined>;
    attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void>;
    detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void>;
}
