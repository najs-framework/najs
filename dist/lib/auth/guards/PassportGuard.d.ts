import { Guard } from './Guard';
import { IAuthenticatable } from '../interfaces/IAuthenticatable';
export declare class PassportGuard extends Guard {
    hasUser(): boolean;
    hasUser<T extends IAuthenticatable = IAuthenticatable>(user: T): boolean;
    /**
     * Get the currently authenticated user.
     */
    retrieveUser<T extends IAuthenticatable = IAuthenticatable>(): Promise<T | undefined>;
    /**
     * Save the user to request.
     *
     * @param {IAuthenticatable} user
     * @param {boolean} remember
     */
    attachUser<T extends IAuthenticatable = IAuthenticatable>(user: T, remember: boolean): Promise<void>;
    /**
     * Remove the user and out of request.
     *
     * @param {IAuthenticatable} user
     */
    detachUser<T extends IAuthenticatable = IAuthenticatable>(user: T): Promise<void>;
}
