import { IGenericUser } from './interfaces/IGenericUser';
import { IAuthenticatable } from './interfaces/IAuthenticatable';
import { Model } from 'najs-eloquent';
import { Schema } from 'mongoose';
export declare class GenericUser extends Model implements IAuthenticatable, IGenericUser {
    static className: string;
    id?: string;
    email: string;
    remember_token: string;
    getClassName(): string;
    getSchema(): Schema;
    password: string;
    readonly password_salt: string;
    protected hashPassword(password: string): any;
    protected cleanSecretAttribute(value: Object): Object;
    toObject(): Object;
    toJSON(): Object;
    getAuthIdentifierName(): string;
    getAuthIdentifier(): any;
    getAuthPassword(password?: string): string;
    getRememberToken(): string;
    setRememberToken(value: string): void;
    getRememberTokenName(): string;
}
