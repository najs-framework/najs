export interface IAuthenticatable {
  /**
   * Get the name of the unique identifier for the user.
   */
  getAuthIdentifierName(): string

  /**
   * Get the unique identifier for the user.
   */
  getAuthIdentifier(): any

  /**
   * Get the password for the user.
   */
  getAuthPassword(): string

  /**
   * Get the token value for the "remember me" session.
   */
  getRememberToken(): string

  /**
   * Set the token value for the "remember me" session.
   * @param {string} value
   */
  setRememberToken(value: string): void

  /**
   * Get the column name for the "remember me" token.
   */
  getRememberTokenName(): string
}
