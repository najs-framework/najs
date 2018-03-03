import { ContextualFacade } from 'najs-facade';
import { IGuard, GuardConfiguration } from './interfaces/IGuard';
import { IAuth } from './interfaces/IAuth';
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
     * Indicates if the logout method has been called.
     */
    protected loggedOut: boolean;
    /**
     * Guard's configuration
     */
    protected configurations: {
        [key: string]: GuardConfiguration;
    };
    /**
     * guard's instance bag
     */
    protected guardBag: {
        [key: string]: IGuard;
    };
    constructor(controller: Controller);
    findDefaultGuardName(): string;
    resolveGuard(name: string): IGuard | undefined;
    getCurrentGuard(): IGuard;
    guard(name: string): IAuth;
    login(user: IAuthenticatable): Promise<void>;
    login(user: IAuthenticatable, remember: boolean): Promise<void>;
    logout(): Promise<void>;
    attempt(credentials: Object, remember?: boolean, login?: boolean): Promise<boolean>;
    validate(credentials: Object): Promise<boolean>;
    check(): boolean;
    guest(): boolean;
    user<T extends IAuthenticatable = IAuthenticatable>(): T | undefined;
    id<T extends any = string>(): T | undefined;
    getUser<T extends IAuthenticatable = IAuthenticatable>(): T | undefined;
    setUser<T extends IAuthenticatable = IAuthenticatable>(user: T): void;
}
