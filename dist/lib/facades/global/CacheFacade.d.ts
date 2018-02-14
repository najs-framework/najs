import '../../../lib/cache/RedisCache';
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar';
import { ICache } from '../../../lib/cache/ICache';
export declare const Cache: ICache & IFacadeBase;
export declare const CacheFacade: ICache & IFacade;
