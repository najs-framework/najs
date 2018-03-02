import { IAuthenticatable } from './IAuthenticatable';
export interface IUserProvider {
    /**
     * Retrieve a user by their unique identifier.
     *
     * @param identifier
     */
    retrieveById<T extends IAuthenticatable = IAuthenticatable>(identifier: any): Promise<T | undefined>;
    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     *
     * @param identifier
     * @param {string} token
     */
    retrieveByToken<T extends IAuthenticatable = IAuthenticatable>(identifier: any, token: string): Promise<T | undefined>;
    /**
     * Update the "remember me" token for the given user in storage.
     */
    updateRememberToken<T extends IAuthenticatable = IAuthenticatable>(user: T, token: string): Promise<void>;
    /**
     * Retrieve a user by the given credentials.
     *
     * @param {Object} credentials
     */
    retrieveByCredentials<T extends IAuthenticatable = IAuthenticatable>(credentials: Object): Promise<T | undefined>;
    /**
     * Retrieve a user by the given credentials.
     *
     * @param {IAuthenticatable} user
     * @param {Object} credentials
     */
    validateCredentials<T extends IAuthenticatable = IAuthenticatable>(user: T, credentials: Object): Promise<boolean>;
}
