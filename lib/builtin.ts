import { WinstonLogger } from './log/WinstonLogger'
import { Path } from './file-system/Path'
import { RedisCache } from './cache/RedisCache'
import { JsonExpectation } from './test/supertest/JsonExpectation'

export type BuiltinClasses = {
  Cache: {
    RedisCache: typeof RedisCache
  }
  FileSystem: {
    Path: typeof Path
  }
  Log: {
    WinstonLogger: typeof WinstonLogger
  }
  Test: {
    SuperTestExpectation: {
      JsonExpectation: typeof JsonExpectation
    }
  }
}
