import '../../auth/AuthManager';
import { IContextualFacadeVerbOf, IContextualFacadeVerbFrom } from 'najs-facade';
import { AuthManager } from '../../auth/AuthManager';
import { Controller } from '../../http/controller/Controller';
export declare const Auth: IContextualFacadeVerbOf<AuthManager, Controller> & IContextualFacadeVerbFrom<AuthManager, Controller>;
export declare const AuthContextualFacade: IContextualFacadeVerbOf<AuthManager, Controller> & IContextualFacadeVerbFrom<AuthManager, Controller>;
