import { IContextualFacadeVerbOf } from '../interfaces/IFacadeGrammar';
import { ContextualFacadeFactory } from '../ContextualFacadeFactory';
import { ContextualFacade } from '../ContextualFacade';
export declare class InputFacade extends ContextualFacade {
    doSomething(): void;
}
export declare class InputContextualFacadeFactory<Context extends any> extends ContextualFacadeFactory<Context> {
    protected createContextualFacade(context: Context): InputFacade;
}
export declare const InputContextualFacade: IContextualFacadeVerbOf<InputFacade, any>;
