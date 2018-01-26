import { IResponse } from './IResponse';
export interface IResponseFacade {
    json(value: any): IResponse;
    redirect(url: string): IResponse;
    redirect(url: string, status: number): IResponse;
}
