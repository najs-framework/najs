import { IFacadeContainer } from './interfaces/IFacadeContainer';
export declare const FacadeContainersBag: IFacadeContainer[];
export declare class FacadeContainer {
    protected usedFacades: {
        spy?: string[];
        mock?: string[];
        stub?: string[];
    };
    markFacadeWasUsed(key: string, type: 'mock'): void;
    markFacadeWasUsed(key: string, type: 'spy'): void;
    markFacadeWasUsed(key: string, type: 'stub'): void;
    verifyMocks(): void;
    restoreFacades(): void;
}
