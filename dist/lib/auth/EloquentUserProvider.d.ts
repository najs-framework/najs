import { IAutoload } from 'najs-binding';
import { IAuthenticatable } from './interfaces/IAuthenticatable';
import { IUserProvider } from './interfaces/IUserProvider';
export declare type EloquentQuery = {
    where(field: string, value: any): any;
};
export declare class EloquentUserProvider implements IUserProvider, IAutoload {
    static className: string;
    model: IAuthenticatable & EloquentQuery;
    constructor();
    getClassName(): string;
    getModelName(): string;
    getLoginName(): string;
    getPasswordName(): string;
    protected isValidCredentials(credentials: Object): boolean;
    retrieveById<T extends IAuthenticatable = IAuthenticatable>(identifier: any): Promise<T | undefined>;
    retrieveByToken<T extends IAuthenticatable = IAuthenticatable>(identifier: any, token: string): Promise<T | undefined>;
    updateRememberToken<T extends IAuthenticatable = IAuthenticatable>(user: T, token: string): Promise<void>;
    retrieveByCredentials<T extends IAuthenticatable = IAuthenticatable>(credentials: Object): Promise<T | undefined>;
    validateCredentials<T extends IAuthenticatable = IAuthenticatable>(user: T, credentials: Object): Promise<boolean>;
}
