import * as Benchmark from 'benchmark'
import * as Redis from 'redis'
import { RedisFacade } from '../lib/facades/global/RedisFacade'

const redis = Redis.createClient({
  host: 'localhost',
  port: 6379
})

const suite = new Benchmark.Suite()
suite
  .add('NodeRedis.append()', {
    defer: true,
    fn: function(defer: any) {
      redis.append('append#1', '0', function(error: any, result: any) {
        defer.resolve()
      })
    }
  })
  .add('RedisClientFacade.append() as Promise', {
    defer: true,
    fn: function(defer: any) {
      RedisFacade.append('append#2', '0').then(function() {
        defer.resolve()
      })
    }
  })
  .add('await RedisClientFacade.append()', {
    defer: true,
    fn: async function(defer: any) {
      await RedisFacade.append('append#3', '0')
      defer.resolve()
    }
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })

redis.del('append#1', 'append#2', 'append#3', function() {
  suite.run({ async: false })
})
