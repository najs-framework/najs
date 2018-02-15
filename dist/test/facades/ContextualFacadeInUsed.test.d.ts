import 'jest';
import { ContextualFacade } from '../../lib/facades/ContextualFacade';
import { IContextualFacadeVerbOf } from '../../lib/facades/interfaces/IFacadeGrammar';
export declare class InputFacade extends ContextualFacade {
    doSomething(): void;
}
export declare const Input: IContextualFacadeVerbOf<InputFacade, any>;
