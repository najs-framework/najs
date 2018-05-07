import { Path } from './file-system/Path';
import { RedisCache } from './cache/RedisCache';
export declare type BuiltinClasses = {
    Cache: {
        RedisCache: typeof RedisCache;
    };
    FileSystem: {
        Path: typeof Path;
    };
};
