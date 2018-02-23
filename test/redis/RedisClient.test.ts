import 'jest'
import * as Sinon from 'sinon'
import * as Redis from 'redis'
import { Facade } from '../../lib/facades/Facade'
import { GlobalFacadeClass } from '../../lib/constants'
import { RedisClient } from '../../lib/redis/RedisClient'
import { ClassRegistry } from 'najs-binding'
import { isPromise } from '../../lib/private/isPromise'
import { ConfigurationKeys } from '../../lib/constants'
import { ConfigFacade } from '../../lib/facades/global/ConfigFacade'
import { FacadeContainer } from '../../lib/facades/FacadeContainer'

describe('RedisClient', function() {
  let redisClient: RedisClient
  beforeAll(function() {
    redisClient = new RedisClient()
  })

  it('extends from Facade so it definitely a FacadeClass', function() {
    expect(redisClient).toBeInstanceOf(Facade)
    expect(redisClient.getClassName()).toEqual(GlobalFacadeClass.Redis)
    expect(ClassRegistry.has(GlobalFacadeClass.Redis)).toBe(true)
  })

  describe('constructor()', function() {
    it('calls createClient() with default and config get from ConfigFacade', function() {
      ConfigFacade.shouldReceive('get').withArgs(ConfigurationKeys.Redis, {
        host: 'localhost',
        port: 6379
      })
      const newRedisClient = new RedisClient()
      expect(newRedisClient.getCurrentClient()).toEqual('default')
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })

  describe('.createClient()', function() {
    it('creates new client and put into bucket if the name is not exists', function() {
      redisClient.createClient('test', {
        host: 'localhost',
        port: 6379
      })
      expect(typeof redisClient['bucket']['test'] === 'object').toBe(true)
    })

    it('does not creates new client the name is exists', function() {
      redisClient.createClient('default', {
        host: 'localhost',
        port: 6379
      })
      expect(redisClient.getCurrentClient()).toEqual('default')
    })

    it('always return created/existing client', function() {
      expect(
        redisClient.createClient('test', {
          host: 'localhost',
          port: 6379
        }) === redisClient['bucket']['test']
      ).toBe(true)
      expect(redisClient.getCurrentClient()).toEqual('default')
    })
  })

  describe('.useClient()', function() {
    it('sets currentBucket to the name if it exists', function() {
      expect(redisClient.useClient('test').getCurrentClient()).toEqual('test')
      expect(redisClient.useClient('default').getCurrentClient()).toEqual('default')
    })

    it('throws an Error if the name is not in bucket list', function() {
      try {
        redisClient.useClient('test-not-found')
      } catch (error) {
        expect(error.message).toEqual('RedisClient "test-not-found" is not found')
        return
      }
      expect('should not reach this line').toEqual('hm')
    })
  })

  describe('.getClient()', function() {
    it('returns native redis client if name exists', function() {
      expect(redisClient.getClient('test') === redisClient['bucket']['test']).toBe(true)
    })

    it('throws an Error if the name is not in bucket list', function() {
      try {
        redisClient.getClient('test-not-found')
      } catch (error) {
        expect(error.message).toEqual('RedisClient "test-not-found" is not found')
        return
      }
      expect('should not reach this line').toEqual('hm')
    })
  })

  describe('.getCurrentClient()', function() {
    it('simply returns currentBucket', function() {})
  })

  describe('.hasClient()', function() {
    it('simply returns true if there is client with name in bucket', function() {
      expect(redisClient.hasClient('default')).toBe(true)
      expect(redisClient.hasClient('test')).toBe(true)
      expect(redisClient.hasClient('test-not-found')).toBe(false)
    })
  })

  describe('protected .redisClientProxy()', function() {
    it('simply calls RedisClient.prototype[method] with custom callback', function() {
      const redisStub = Sinon.stub(Redis.RedisClient.prototype, 'get')
      expect(isPromise(redisClient['redisClientProxy']('get', ['test']))).toBe(true)
      expect(redisStub.calledWith('test')).toBe(true)
      expect(typeof redisStub.lastCall.args[1] === 'function').toBe(true)
      expect(redisStub.lastCall.thisValue === redisClient['bucket']['default']).toBe(true)
      redisClient.createClient('test', {
        host: 'localhost',
        port: 6379
      })
      redisClient.useClient('test')
      redisClient['redisClientProxy']('get', ['test'])
      expect(redisStub.lastCall.thisValue === redisClient['bucket']['test']).toBe(true)
      redisStub.restore()
    })

    it('calls Promise.resolve if there is no error', async function() {
      const result = await redisClient['redisClientProxy']('append', ['test', 'a'])
      expect(result).toBeGreaterThan(0)
    })

    it('call Promise.reject if there is any error', async function() {
      const redisStub = Sinon.stub(Redis.RedisClient.prototype, 'get')
      try {
        redisStub.callsFake(function(key, done) {
          done(new Error(key))
        })
        const redisClient = new RedisClient()
        await redisClient['redisClientProxy']('get', ['test'])
      } catch (error) {
        expect(error.message).toEqual('test')
        redisStub.restore()
        return
      }
      expect('should not reach this line').toEqual('hm')
    })
  })

  // -------------------------------------------------------------------------------------------------------------------

  function redisClientProxy_test_for(facadeMethod: string, redisMethod: string, args: any[]) {
    describe('.' + facadeMethod + '()', function() {
      it('returns a promise', function() {
        const redisClientProxyStub = Sinon.stub(redisClient, <any>'redisClientProxy')
        redisClientProxyStub.callsFake(async function() {})
        expect(isPromise(redisClient[facadeMethod](...args))).toBe(true)
        redisClientProxyStub.restore()
      })

      it('calls .redisClientProxy(), passes method name and arguments', async function() {
        const redisClientProxyStub = Sinon.stub(redisClient, <any>'redisClientProxy')
        redisClientProxyStub.callsFake(async function() {
          return true
        })
        redisClient[facadeMethod](...args)
        expect(redisClientProxyStub.calledWith(redisMethod)).toBe(true)
        expect(Array.from(redisClientProxyStub.lastCall.args[1])).toEqual(args)
        redisClientProxyStub.restore()
      })
    })
  }

  redisClientProxy_test_for('monitor', 'monitor', [])
  redisClientProxy_test_for('info', 'info', [])
  redisClientProxy_test_for('info', 'info', ['test'])
  redisClientProxy_test_for('ping', 'ping', [])
  redisClientProxy_test_for('ping', 'ping', ['test'])
  redisClientProxy_test_for('publish', 'publish', ['test', 'value'])
  redisClientProxy_test_for('client', 'client', [])
  redisClientProxy_test_for('client', 'client', ['test', 'value'])
  redisClientProxy_test_for('hmset', 'hmset', ['test'])
  redisClientProxy_test_for('hmset', 'hmset', ['test', '0', '1', '2'])
  redisClientProxy_test_for('hmset', 'hmset', ['test', 0, 1, 2])
  redisClientProxy_test_for('subscribe', 'subscribe', ['channel'])
  redisClientProxy_test_for('subscribe', 'subscribe', [['channel', 'another-channel']])
  redisClientProxy_test_for('unsubscribe', 'unsubscribe', ['channel'])
  redisClientProxy_test_for('unsubscribe', 'unsubscribe', [['channel', 'another-channel']])
  redisClientProxy_test_for('psubscribe', 'psubscribe', ['channel'])
  redisClientProxy_test_for('psubscribe', 'psubscribe', [['channel', 'another-channel']])
  redisClientProxy_test_for('punsubscribe', 'punsubscribe', ['channel'])
  redisClientProxy_test_for('punsubscribe', 'punsubscribe', [['channel', 'another-channel']])

  redisClientProxy_test_for('auth', 'auth', ['password'])
  redisClientProxy_test_for('append', 'append', ['test', 'abc'])

  redisClientProxy_test_for('bgrewriteaof', 'bgrewriteaof', [])
  redisClientProxy_test_for('bgsave', 'bgsave', [])
  redisClientProxy_test_for('bitcount', 'bitcount', ['test'])
  redisClientProxy_test_for('bitcount', 'bitcount', ['test', 1, 2])
  redisClientProxy_test_for('bitfield', 'bitfield', ['test', 1])
  redisClientProxy_test_for('bitfield', 'bitfield', ['test', [1]])
  redisClientProxy_test_for('bitfield', 'bitfield', ['test', ['test']])
  redisClientProxy_test_for('bitop', 'bitop', ['test', 'a', 'b', 'c', 'd'])
  redisClientProxy_test_for('bitpos', 'bitpos', ['test', 1, 0, 2])
  redisClientProxy_test_for('blpop', 'blpop', ['test', 'value'])
  redisClientProxy_test_for('brpop', 'brpop', ['test', 'value'])
  redisClientProxy_test_for('brpoplpush', 'brpoplpush', ['list', 'another-list', 10])

  redisClientProxy_test_for('cluster', 'cluster', [])
  redisClientProxy_test_for('cluster', 'cluster', ['test', 'value'])
  redisClientProxy_test_for('command', 'command', [])
  redisClientProxy_test_for('config', 'config', [])
  redisClientProxy_test_for('config', 'config', ['test', 'value'])

  redisClientProxy_test_for('dbsize', 'dbsize', [])
  redisClientProxy_test_for('debug', 'debug', [])
  redisClientProxy_test_for('debug', 'debug', ['test', 'value'])
  redisClientProxy_test_for('decr', 'decr', ['test'])
  redisClientProxy_test_for('decrby', 'decrby', ['test', 1])
  redisClientProxy_test_for('del', 'del', [])
  redisClientProxy_test_for('del', 'del', ['test', 'value'])
  redisClientProxy_test_for('discard', 'discard', [])
  redisClientProxy_test_for('dump', 'dump', ['test'])

  redisClientProxy_test_for('echo', 'echo', ['test'])
  redisClientProxy_test_for('eval', 'eval', [])
  redisClientProxy_test_for('eval', 'eval', ['test', 'value'])
  redisClientProxy_test_for('evalsha', 'evalsha', [])
  redisClientProxy_test_for('evalsha', 'evalsha', ['test', 'value'])
  redisClientProxy_test_for('exists', 'exists', [])
  redisClientProxy_test_for('exists', 'exists', ['test', 'value'])
  redisClientProxy_test_for('expire', 'expire', ['test', 12])
  redisClientProxy_test_for('expireat', 'expireat', ['test', 1212121212])

  redisClientProxy_test_for('flushall', 'flushall', [])
  redisClientProxy_test_for('flushdb', 'flushdb', [])

  redisClientProxy_test_for('geoadd', 'geoadd', [])
  redisClientProxy_test_for('geoadd', 'geoadd', ['test'])
  redisClientProxy_test_for('geoadd', 'geoadd', ['test', 'value'])
  redisClientProxy_test_for('geoadd', 'geoadd', ['test', 0])
  redisClientProxy_test_for('geoadd', 'geoadd', ['test', 0, 1])
  redisClientProxy_test_for('geoadd', 'geoadd', ['test', 0, 1, 2])
  redisClientProxy_test_for('geohash', 'geohash', [])
  redisClientProxy_test_for('geohash', 'geohash', ['test'])
  redisClientProxy_test_for('geohash', 'geohash', ['test', 'value'])
  redisClientProxy_test_for('geohash', 'geohash', ['test', '0'])
  redisClientProxy_test_for('geohash', 'geohash', ['test', '0', '1'])
  redisClientProxy_test_for('geohash', 'geohash', ['test', '0', '1', '2'])
  redisClientProxy_test_for('geopos', 'geopos', [])
  redisClientProxy_test_for('geopos', 'geopos', ['test'])
  redisClientProxy_test_for('geopos', 'geopos', ['test', 'value'])
  redisClientProxy_test_for('geopos', 'geopos', ['test', '0'])
  redisClientProxy_test_for('geopos', 'geopos', ['test', '0', '1'])
  redisClientProxy_test_for('geopos', 'geopos', ['test', '0', '1', '2'])
  redisClientProxy_test_for('geodist', 'geodist', [])
  redisClientProxy_test_for('geodist', 'geodist', ['test'])
  redisClientProxy_test_for('geodist', 'geodist', ['test', 'value'])
  redisClientProxy_test_for('geodist', 'geodist', ['test', '0'])
  redisClientProxy_test_for('geodist', 'geodist', ['test', '0', '1'])
  redisClientProxy_test_for('geodist', 'geodist', ['test', '0', '1', '2'])
  redisClientProxy_test_for('georadius', 'georadius', [])
  redisClientProxy_test_for('georadius', 'georadius', ['test'])
  redisClientProxy_test_for('georadius', 'georadius', ['test', 'value'])
  redisClientProxy_test_for('georadius', 'georadius', ['test', 0])
  redisClientProxy_test_for('georadius', 'georadius', ['test', 0, 1])
  redisClientProxy_test_for('georadius', 'georadius', ['test', 0, 1, 2])
  redisClientProxy_test_for('georadiusbymember', 'georadiusbymember', [])
  redisClientProxy_test_for('georadiusbymember', 'georadiusbymember', ['test'])
  redisClientProxy_test_for('georadiusbymember', 'georadiusbymember', ['test', 'value'])
  redisClientProxy_test_for('georadiusbymember', 'georadiusbymember', ['test', 0])
  redisClientProxy_test_for('georadiusbymember', 'georadiusbymember', ['test', 0, 1])
  redisClientProxy_test_for('georadiusbymember', 'georadiusbymember', ['test', 0, 1, 2])
  redisClientProxy_test_for('get', 'get', ['test'])
  redisClientProxy_test_for('getbit', 'getbit', ['test', 7])
  redisClientProxy_test_for('getrange', 'getrange', ['test', 0, 3])
  redisClientProxy_test_for('getset', 'getset', ['test', 'value'])

  redisClientProxy_test_for('hdel', 'hdel', [])
  redisClientProxy_test_for('hdel', 'hdel', ['test'])
  redisClientProxy_test_for('hdel', 'hdel', ['test', 'value'])
  redisClientProxy_test_for('hdel', 'hdel', ['test', 0])
  redisClientProxy_test_for('hdel', 'hdel', ['test', 0, 1])
  redisClientProxy_test_for('hdel', 'hdel', ['test', 0, 1, 2])
  redisClientProxy_test_for('hexists', 'hexists', ['test', 'value'])
  redisClientProxy_test_for('hget', 'hget', ['test', 'value'])
  redisClientProxy_test_for('hgetall', 'hgetall', ['test'])
  redisClientProxy_test_for('hincrby', 'hincrby', ['test', 'value', 3])
  redisClientProxy_test_for('hincrbyfloat', 'hincrbyfloat', ['test', 'value', 3.0])
  redisClientProxy_test_for('hkeys', 'hkeys', ['test'])
  redisClientProxy_test_for('hlen', 'hlen', ['test'])
  redisClientProxy_test_for('hmget', 'hmget', [])
  redisClientProxy_test_for('hmget', 'hmget', ['test'])
  redisClientProxy_test_for('hmget', 'hmget', ['test', 'value'])
  redisClientProxy_test_for('hmget', 'hmget', ['test', 0])
  redisClientProxy_test_for('hmget', 'hmget', ['test', 0, 1])
  redisClientProxy_test_for('hmget', 'hmget', ['test', 0, 1, 2])
  redisClientProxy_test_for('hmget', 'hmget', ['test', 'value', 'value'])
  redisClientProxy_test_for('hset', 'hset', ['test', 'value', 'value'])
  redisClientProxy_test_for('hsetnx', 'hsetnx', ['test', 'value', 'value'])
  redisClientProxy_test_for('hstrlen', 'hstrlen', ['test', 'value'])
  redisClientProxy_test_for('hvals', 'hvals', ['test'])

  redisClientProxy_test_for('incr', 'incr', ['test'])
  redisClientProxy_test_for('incrby', 'incrby', ['test', 3])
  redisClientProxy_test_for('incrbyfloat', 'incrbyfloat', ['test', 3.0])

  redisClientProxy_test_for('keys', 'keys', ['test'])

  redisClientProxy_test_for('lastsave', 'lastsave', [])
  redisClientProxy_test_for('lindex', 'lindex', ['test', 1])
  redisClientProxy_test_for('linsert', 'linsert', ['test', 'AFTER', 'test', 'value'])
  redisClientProxy_test_for('llen', 'llen', ['test'])
  redisClientProxy_test_for('lpop', 'lpop', ['test'])
  redisClientProxy_test_for('lpush', 'lpush', [])
  redisClientProxy_test_for('lpush', 'lpush', ['test'])
  redisClientProxy_test_for('lpush', 'lpush', ['test', 'value'])
  redisClientProxy_test_for('lpush', 'lpush', ['test', 0])
  redisClientProxy_test_for('lpush', 'lpush', ['test', 0, 1])
  redisClientProxy_test_for('lpush', 'lpush', ['test', 0, 1, 2])
  redisClientProxy_test_for('lpush', 'lpush', ['test', 'value', 'value'])
  redisClientProxy_test_for('lpushx', 'lpushx', ['lpushx', 'value'])
  redisClientProxy_test_for('lrange', 'lrange', ['test', 0, 1])
  redisClientProxy_test_for('lrem', 'lrem', ['test', 1, 'value'])
  redisClientProxy_test_for('lset', 'lset', ['test', 1, 'value'])
  redisClientProxy_test_for('ltrim', 'ltrim', ['test', 1, 2])

  redisClientProxy_test_for('mget', 'mget', [])
  redisClientProxy_test_for('mget', 'mget', ['test', 'value'])
  redisClientProxy_test_for('migrate', 'migrate', [])
  redisClientProxy_test_for('migrate', 'migrate', ['test', 'value'])
  redisClientProxy_test_for('move', 'move', ['test', 1])
  redisClientProxy_test_for('mset', 'mset', [])
  redisClientProxy_test_for('mset', 'mset', ['test', 'value'])
  redisClientProxy_test_for('msetnx', 'msetnx', [])
  redisClientProxy_test_for('msetnx', 'msetnx', ['test', 'value'])

  redisClientProxy_test_for('object', 'object', [])
  redisClientProxy_test_for('object', 'object', ['test', 'value'])

  redisClientProxy_test_for('persist', 'persist', ['test'])
  redisClientProxy_test_for('pexpire', 'pexpire', ['test', 1])
  redisClientProxy_test_for('pexpireat', 'pexpireat', ['test', 1])
  redisClientProxy_test_for('pfadd', 'pfadd', [])
  redisClientProxy_test_for('pfadd', 'pfadd', ['test'])
  redisClientProxy_test_for('pfadd', 'pfadd', ['test', 'value'])
  redisClientProxy_test_for('pfadd', 'pfadd', ['test', 0])
  redisClientProxy_test_for('pfadd', 'pfadd', ['test', 0, 1])
  redisClientProxy_test_for('pfadd', 'pfadd', ['test', 0, 1, 2])
  redisClientProxy_test_for('pfadd', 'pfadd', ['test', 'value', 'value'])
  redisClientProxy_test_for('pfcount', 'pfcount', [])
  redisClientProxy_test_for('pfcount', 'pfcount', ['test', 'value'])
  redisClientProxy_test_for('pfmerge', 'pfmerge', [])
  redisClientProxy_test_for('pfmerge', 'pfmerge', ['test', 'value'])
  redisClientProxy_test_for('psetex', 'psetex', ['test', 1, 'value'])
  redisClientProxy_test_for('pubsub', 'pubsub', [])
  redisClientProxy_test_for('pubsub', 'pubsub', ['test', 'value'])
  redisClientProxy_test_for('pttl', 'pttl', ['test'])

  redisClientProxy_test_for('quit', 'quit', [])

  redisClientProxy_test_for('randomkey', 'randomkey', [])
  redisClientProxy_test_for('readonly', 'readonly', [])
  redisClientProxy_test_for('readwrite', 'readwrite', [])
  redisClientProxy_test_for('rename', 'rename', ['test', 'test-new'])
  redisClientProxy_test_for('renamenx', 'renamenx', ['test', 'test-new'])
  redisClientProxy_test_for('restore', 'restore', ['test', 1, 'value'])
  redisClientProxy_test_for('role', 'role', [])
  redisClientProxy_test_for('rpop', 'rpop', ['test'])
  redisClientProxy_test_for('rpoplpush', 'rpoplpush', ['test', 'value'])
  redisClientProxy_test_for('rpush', 'rpush', [])
  redisClientProxy_test_for('rpush', 'rpush', ['test'])
  redisClientProxy_test_for('rpush', 'rpush', ['test', 'value'])
  redisClientProxy_test_for('rpush', 'rpush', ['test', 0])
  redisClientProxy_test_for('rpush', 'rpush', ['test', 0, 1])
  redisClientProxy_test_for('rpush', 'rpush', ['test', 0, 1, 2])
  redisClientProxy_test_for('rpush', 'rpush', ['test', 'value', 'value'])
  redisClientProxy_test_for('rpushx', 'rpushx', ['test', 'value'])

  redisClientProxy_test_for('sadd', 'sadd', [])
  redisClientProxy_test_for('sadd', 'sadd', ['test'])
  redisClientProxy_test_for('sadd', 'sadd', ['test', 'value'])
  redisClientProxy_test_for('sadd', 'sadd', ['test', 0])
  redisClientProxy_test_for('sadd', 'sadd', ['test', 0, 1])
  redisClientProxy_test_for('sadd', 'sadd', ['test', 0, 1, 2])
  redisClientProxy_test_for('sadd', 'sadd', ['test', 'value', 'value'])
  redisClientProxy_test_for('save', 'save', [])
  redisClientProxy_test_for('scard', 'scard', ['test'])
  redisClientProxy_test_for('script', 'script', [])
  redisClientProxy_test_for('script', 'script', ['test', 'value'])
  redisClientProxy_test_for('sdiff', 'sdiff', [])
  redisClientProxy_test_for('sdiff', 'sdiff', ['test', 'value'])
  redisClientProxy_test_for('sdiffstore', 'sdiffstore', [])
  redisClientProxy_test_for('sdiffstore', 'sdiffstore', ['test'])
  redisClientProxy_test_for('sdiffstore', 'sdiffstore', ['test', 'value'])
  redisClientProxy_test_for('sdiffstore', 'sdiffstore', ['test', 0])
  redisClientProxy_test_for('sdiffstore', 'sdiffstore', ['test', 0, 1])
  redisClientProxy_test_for('sdiffstore', 'sdiffstore', ['test', 0, 1, 2])
  redisClientProxy_test_for('sdiffstore', 'sdiffstore', ['test', 'value', 'value'])
  redisClientProxy_test_for('select', 'select', ['test'])
  redisClientProxy_test_for('select', 'select', [0])
  redisClientProxy_test_for('set', 'set', ['test', 'value'])
  redisClientProxy_test_for('set', 'set', ['test', 'value', 'any'])
  redisClientProxy_test_for('set', 'set', ['test', 'value', 'any', 12])
  redisClientProxy_test_for('set', 'set', ['test', 'value', 'any', 12, 'any'])
  redisClientProxy_test_for('setbit', 'setbit', ['test', 0, '1'])
  redisClientProxy_test_for('setex', 'setex', ['test', 12, 'value'])
  redisClientProxy_test_for('setnx', 'setnx', ['test', 'value'])
  redisClientProxy_test_for('setrange', 'setrange', ['test', 0, 'value'])
  redisClientProxy_test_for('shutdown', 'shutdown', [])
  redisClientProxy_test_for('shutdown', 'shutdown', ['test', 'value'])
  redisClientProxy_test_for('sinter', 'sinter', [])
  redisClientProxy_test_for('sinter', 'sinter', ['test'])
  redisClientProxy_test_for('sinter', 'sinter', ['test', 'value'])
  redisClientProxy_test_for('sinter', 'sinter', ['test', 0])
  redisClientProxy_test_for('sinter', 'sinter', ['test', 0, 1])
  redisClientProxy_test_for('sinter', 'sinter', ['test', 0, 1, 2])
  redisClientProxy_test_for('sinter', 'sinter', ['test', 'value', 'value'])
  redisClientProxy_test_for('sinterstore', 'sinterstore', [])
  redisClientProxy_test_for('sinterstore', 'sinterstore', ['test', 'value'])
  redisClientProxy_test_for('sismember', 'sismember', ['test', 'member'])
  redisClientProxy_test_for('slaveof', 'slaveof', ['localhost', '6666'])
  redisClientProxy_test_for('slowlog', 'slowlog', [])
  redisClientProxy_test_for('slowlog', 'slowlog', ['test', 'value'])
  redisClientProxy_test_for('smembers', 'smembers', ['test'])
  redisClientProxy_test_for('smove', 'smove', ['source', 'destination', 'test'])
  redisClientProxy_test_for('sort', 'sort', [])
  redisClientProxy_test_for('sort', 'sort', ['test', 'value'])
  redisClientProxy_test_for('spop', 'spop', ['test'])
  redisClientProxy_test_for('spop', 'spop', ['test', 2])
  redisClientProxy_test_for('srandmember', 'srandmember', ['test'])
  redisClientProxy_test_for('srandmember', 'srandmember', ['test', 2])
  redisClientProxy_test_for('srem', 'srem', [])
  redisClientProxy_test_for('srem', 'srem', ['test'])
  redisClientProxy_test_for('srem', 'srem', ['test', 'value'])
  redisClientProxy_test_for('srem', 'srem', ['test', 0])
  redisClientProxy_test_for('srem', 'srem', ['test', 0, 1])
  redisClientProxy_test_for('srem', 'srem', ['test', 0, 1, 2])
  redisClientProxy_test_for('srem', 'srem', ['test', 'value', 'value'])
  redisClientProxy_test_for('strlen', 'strlen', ['test'])
  redisClientProxy_test_for('sunion', 'sunion', [])
  redisClientProxy_test_for('sunion', 'sunion', ['test', 'value'])
  redisClientProxy_test_for('sunionstore', 'sunionstore', [])
  redisClientProxy_test_for('sunionstore', 'sunionstore', ['test', 'value'])
  redisClientProxy_test_for('sync', 'sync', [])

  redisClientProxy_test_for('time', 'time', [])
  redisClientProxy_test_for('ttl', 'ttl', ['test'])
  redisClientProxy_test_for('type', 'type', ['test'])

  redisClientProxy_test_for('unwatch', 'unwatch', [])
  redisClientProxy_test_for('wait', 'wait', [1, 10000])
  redisClientProxy_test_for('watch', 'watch', [])
  redisClientProxy_test_for('watch', 'watch', ['test', 'value'])

  redisClientProxy_test_for('zadd', 'zadd', [])
  redisClientProxy_test_for('zadd', 'zadd', ['test'])
  redisClientProxy_test_for('zadd', 'zadd', ['test', 'value'])
  redisClientProxy_test_for('zadd', 'zadd', ['test', 0])
  redisClientProxy_test_for('zadd', 'zadd', ['test', 0, 1])
  redisClientProxy_test_for('zadd', 'zadd', ['test', 0, 1, 2])
  redisClientProxy_test_for('zadd', 'zadd', ['test', 'value', 'value'])
  redisClientProxy_test_for('zcard', 'zcard', ['test'])
  redisClientProxy_test_for('zcount', 'zcount', ['test', 1, 3])
  redisClientProxy_test_for('zcount', 'zcount', ['test', '1', '3'])
  redisClientProxy_test_for('zincrby', 'zincrby', ['test', 1, 'member'])
  redisClientProxy_test_for('zinterstore', 'zinterstore', [])
  redisClientProxy_test_for('zinterstore', 'zinterstore', ['test', 'value'])
  redisClientProxy_test_for('zlexcount', 'zlexcount', ['test', 'min', 'max'])
  redisClientProxy_test_for('zrange', 'zrange', ['test', 0, 1])
  redisClientProxy_test_for('zrange', 'zrange', ['test', 0, 1, 'score'])
  redisClientProxy_test_for('zrevrangebylex', 'zrevrangebylex', ['test', 1, 2])
  redisClientProxy_test_for('zrevrangebylex', 'zrevrangebylex', ['test', 1, 2, 'limit', 0, 1])
  redisClientProxy_test_for('zrangebylex', 'zrangebylex', ['test', 1, 2])
  redisClientProxy_test_for('zrangebylex', 'zrangebylex', ['test', 1, 2, 3, 4, 5])
  redisClientProxy_test_for('zrangebyscore', 'zrangebyscore', ['test', 1, 2])
  redisClientProxy_test_for('zrangebyscore', 'zrangebyscore', ['test', 'min', 'max'])
  redisClientProxy_test_for('zrangebyscore', 'zrangebyscore', ['test', 'min', 'max'])
  redisClientProxy_test_for('zrangebyscore', 'zrangebyscore', ['test', 'min', 'max', 'score'])
  redisClientProxy_test_for('zrangebyscore', 'zrangebyscore', ['test', 'min', 'max', 'limit', 1, 2])
  redisClientProxy_test_for('zrangebyscore', 'zrangebyscore', ['test', 'min', 'max', 'limit', 1, 2, 3])
  redisClientProxy_test_for('zrank', 'zrank', ['test', 'member'])
  redisClientProxy_test_for('zrem', 'zrem', [])
  redisClientProxy_test_for('zrem', 'zrem', ['test'])
  redisClientProxy_test_for('zrem', 'zrem', ['test', 'value'])
  redisClientProxy_test_for('zrem', 'zrem', ['test', 0])
  redisClientProxy_test_for('zrem', 'zrem', ['test', 0, 1])
  redisClientProxy_test_for('zrem', 'zrem', ['test', 0, 1, 2])
  redisClientProxy_test_for('zrem', 'zrem', ['test', 'value', 'value'])
  redisClientProxy_test_for('zremrangebylex', 'zremrangebylex', ['test', 1, 2])
  redisClientProxy_test_for('zremrangebyrank', 'zremrangebyrank', ['test', 1, 2])
  redisClientProxy_test_for('zremrangebyscore', 'zremrangebyscore', ['test', 1, 2])
  redisClientProxy_test_for('zremrangebyscore', 'zremrangebyscore', ['test', 'min', 'max'])
  redisClientProxy_test_for('zrevrange', 'zrevrange', ['test', 1, 2])
  redisClientProxy_test_for('zrevrange', 'zrevrange', ['test', 1, 2, 'score'])
  redisClientProxy_test_for('zrevrangebyscore', 'zrevrangebyscore', ['test', 1, 2])
  redisClientProxy_test_for('zrevrangebyscore', 'zrevrangebyscore', ['test', 1, 2, 'score'])
  redisClientProxy_test_for('zrevrangebyscore', 'zrevrangebyscore', ['test', 1, 2, 'limit', 0, 1])
  redisClientProxy_test_for('zrevrangebyscore', 'zrevrangebyscore', ['test', 1, 2, 'score', 'limit', 0, 1])
  redisClientProxy_test_for('zrevrank', 'zrevrank', ['test', 'member'])
  redisClientProxy_test_for('zscore', 'zscore', ['test', 'member'])
  redisClientProxy_test_for('zunionstore', 'zunionstore', [])
  redisClientProxy_test_for('zunionstore', 'zunionstore', ['test', 'value'])

  redisClientProxy_test_for('scan', 'scan', [])
  redisClientProxy_test_for('scan', 'scan', ['test', 'value'])
  redisClientProxy_test_for('sscan', 'sscan', [])
  redisClientProxy_test_for('sscan', 'sscan', ['test'])
  redisClientProxy_test_for('sscan', 'sscan', ['test', 'value'])
  redisClientProxy_test_for('sscan', 'sscan', ['test', 0])
  redisClientProxy_test_for('sscan', 'sscan', ['test', 0, 1])
  redisClientProxy_test_for('sscan', 'sscan', ['test', 0, 1, 2])
  redisClientProxy_test_for('sscan', 'sscan', ['test', 'value', 'value'])
  redisClientProxy_test_for('hscan', 'hscan', [])
  redisClientProxy_test_for('hscan', 'hscan', ['test'])
  redisClientProxy_test_for('hscan', 'hscan', ['test', 'value'])
  redisClientProxy_test_for('hscan', 'hscan', ['test', 0])
  redisClientProxy_test_for('hscan', 'hscan', ['test', 0, 1])
  redisClientProxy_test_for('hscan', 'hscan', ['test', 0, 1, 2])
  redisClientProxy_test_for('hscan', 'hscan', ['test', 'value', 'value'])
  redisClientProxy_test_for('zscan', 'zscan', [])
  redisClientProxy_test_for('zscan', 'zscan', ['test'])
  redisClientProxy_test_for('zscan', 'zscan', ['test', 'value'])
  redisClientProxy_test_for('zscan', 'zscan', ['test', 0])
  redisClientProxy_test_for('zscan', 'zscan', ['test', 0, 1])
  redisClientProxy_test_for('zscan', 'zscan', ['test', 0, 1, 2])
  redisClientProxy_test_for('zscan', 'zscan', ['test', 'value', 'value'])
})
