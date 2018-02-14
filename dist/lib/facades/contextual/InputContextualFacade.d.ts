import { ContextualFacade } from '../ContextualFacade';
import { IContextualFacadeVerbOf } from '../interfaces/IFacadeGrammar';
export declare class InputFacade extends ContextualFacade {
    doSomething(): void;
}
export declare const InputContextualFacade: IContextualFacadeVerbOf<InputFacade, any>;
