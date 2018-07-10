import 'jest';
import { TestSuite } from './TestSuite';
export declare function jest(group?: string): (Target: any) => void;
export declare function generateTestFromTestSuite(suite: typeof TestSuite): void;
