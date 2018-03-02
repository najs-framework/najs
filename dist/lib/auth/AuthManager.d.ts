import { ContextualFacade } from 'najs-facade';
import { IGuard } from './interfaces/IGuard';
import { IAuth } from './interfaces/IAuth';
import { IUserProvider } from './interfaces/IUserProvider';
import { IAuthenticatable } from './interfaces/IAuthenticatable';
import { Controller } from '../http/controller/Controller';
export declare class AuthManager extends ContextualFacade<Controller> implements IAuth {
    /**
     * The currently authenticated user.
     */
    protected currentUser: IAuthenticatable | undefined;
    /**
     * The currently guard.
     */
    protected currentGuard: IGuard;
    /**
     * The user provider implementation.
     */
    protected provider: IUserProvider;
    /**
     * Indicates if the logout method has been called.
     */
    protected loggedOut: boolean;
    constructor(controller: Controller);
    check(): boolean;
    guest(): boolean;
    user<T extends IAuthenticatable = IAuthenticatable>(): T | undefined;
    id<T extends any = string>(): T | undefined;
    validate(credentials: Object): Promise<boolean>;
    setUser<T extends IAuthenticatable = IAuthenticatable>(user: T): void;
    guard(name: string): IAuth;
    guard(name: Function): IAuth;
    login(user: IAuthenticatable, remember?: boolean): void;
    logout(user: IAuthenticatable): void;
    attempt(credentials: Object, remember?: boolean, login?: boolean): Promise<boolean>;
}
