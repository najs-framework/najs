import { IFacadeContainer } from './interfaces/IFacadeContainer';
export declare class FacadeContainer {
    static Bucket: IFacadeContainer[];
    static clearBucket(): void;
    static verifyAndRestoreAllFacades(): void;
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
