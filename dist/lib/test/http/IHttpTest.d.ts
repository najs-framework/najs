export interface IHttpTest extends Promise<any> {
    send(data?: string | object): this;
}
