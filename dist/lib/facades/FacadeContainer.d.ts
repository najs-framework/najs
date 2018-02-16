import { IFacadeContainer } from './interfaces/IFacadeContainer';
export declare let FacadeContainersBag: IFacadeContainer[];
export declare function cleanFacadeContainersBag(): void;
export declare function verifyAndRestoreFacades(): void;
export declare class FacadeContainer {
    protected cleanable: boolean;
    protected keyByCount: Object;
    protected usedFacades: {
        spy?: string[];
        mock?: string[];
        stub?: string[];
    };
    constructor();
    constructor(cleanable: boolean);
    clean(): boolean;
    getKeyByCount(key: string): string;
    markFacadeWasUsed(key: string, type: 'mock'): void;
    markFacadeWasUsed(key: string, type: 'spy'): void;
    markFacadeWasUsed(key: string, type: 'stub'): void;
    verifyMocks(): void;
    restoreFacades(): void;
}
