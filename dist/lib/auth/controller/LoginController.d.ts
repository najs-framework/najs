import '../../http/response/types/RedirectResponse';
import { RedirectResponse } from '../../http/response/types/RedirectResponse';
import { ExpressController } from '../../http/controller/ExpressController';
export declare class LoginController extends ExpressController {
    getClassName(): string;
    protected getUrl(key: string): any;
    login(): Promise<RedirectResponse>;
    logout(): Promise<RedirectResponse>;
}
