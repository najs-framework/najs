export interface IGenericUser {
    id?: string;
    email: string;
    password: string;
    password_salt: string;
    remember_token: string;
}
