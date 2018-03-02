import { IGuard } from './IGuard';
export interface IAuth extends IGuard {
    use(guard: string): IAuth;
    use(guard: IGuard): IAuth;
    guard(name: string): IAuth;
    guard(name: IGuard): IAuth;
}
