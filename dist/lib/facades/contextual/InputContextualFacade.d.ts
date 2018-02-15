import '../../http/request/RequestInput';
import { IContextualFacadeVerbOf, IContextualFacadeVerbFrom } from '../interfaces/IFacadeGrammar';
import { RequestInput } from '../../http/request/RequestInput';
import { Controller } from '../../http/controller/Controller';
export declare const Input: IContextualFacadeVerbOf<RequestInput, Controller> & IContextualFacadeVerbFrom<RequestInput, Controller>;
export declare const InputContextualFacade: IContextualFacadeVerbOf<RequestInput, Controller> & IContextualFacadeVerbFrom<RequestInput, Controller>;
