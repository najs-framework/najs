import { IGenericUser } from './interfaces/IGenericUser';
import { IAuthenticatable } from './interfaces/IAuthenticatable';
import { EloquentMongooseSpec } from 'najs-eloquent';
import { Schema } from 'mongoose';
export declare const GenericUserBase: EloquentMongooseSpec<IGenericUser, GenericUser>;
export declare class GenericUser extends GenericUserBase implements IAuthenticatable {
    static className: string;
    getClassName(): string;
    getSchema(): Schema;
    password: string;
    readonly password_salt: string;
    protected hashPassword(password: string): any;
    protected cleanSecretAttribute(value: Object): Object;
    toObject(): Object;
    toJson(): Object;
    getAuthIdentifierName(): string;
    getAuthIdentifier(): any;
    getAuthPassword(password?: string): string;
    getRememberToken(): string;
    setRememberToken(value: string): void;
    getRememberTokenName(): string;
}
