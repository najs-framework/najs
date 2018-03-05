import { IGenericUser } from './interfaces/IGenericUser';
import { IAuthenticatable } from './interfaces/IAuthenticatable';
import { IUserProvider } from './interfaces/IUserProvider';
import { EloquentMongooseSpec } from 'najs-eloquent';
import { Schema } from 'mongoose';
export declare const GenericUserBase: EloquentMongooseSpec<IGenericUser, GenericUser>;
export declare class GenericUser extends GenericUserBase implements IAuthenticatable, IUserProvider {
    static className: string;
    getClassName(): string;
    getSchema(): Schema;
    protected isValidCredentials(credentials: Object): any;
    protected createQueryByCredentials(credentials: Object): any;
    protected hashPassword(password: string, passwordSalt: string): string;
    getAuthIdentifierName(): string;
    getAuthIdentifier(): any;
    getAuthPassword(): string;
    getRememberToken(): string;
    setRememberToken(value: string): void;
    getRememberTokenName(): string;
    retrieveById<T extends IAuthenticatable = IAuthenticatable>(identifier: any): Promise<T | undefined>;
    retrieveByToken<T extends IAuthenticatable = IAuthenticatable>(identifier: any, token: string): Promise<T | undefined>;
    updateRememberToken<T extends IAuthenticatable = IAuthenticatable>(user: T, token: string): Promise<void>;
    retrieveByCredentials<T extends IAuthenticatable = IAuthenticatable>(credentials: Object): Promise<T | undefined>;
    validateCredentials<T extends IAuthenticatable = IAuthenticatable>(user: T, credentials: Object): Promise<boolean>;
}
