import 'jest'
import * as Sinon from 'sinon'
import * as Redis from 'redis'
import { Facade } from '../../lib/facades/Facade'
import { GlobalFacadeClass } from '../../lib/constants'
import { RedisClient } from '../../lib/redis/RedisClient'
import { ClassRegistry } from '../../lib/core/ClassRegistry'
import { isPromise } from '../../lib/private/isPromise'
import { ConfigurationKeys } from '../../lib/constants'
import { ConfigFacade } from '../../lib/facades/global/ConfigFacade'
import { FacadeContainer } from '../../lib/facades/FacadeContainer'

describe('RedisClient', function() {
  it('extends from Facade so it definitely a FacadeClass', function() {
    const redisClient = new RedisClient()
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
      const redisClient = new RedisClient()
      expect(redisClient.getCurrentClient()).toEqual('default')
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })

  describe('.createClient()', function() {
    it('creates new client and put into bucket if the name is not exists', function() {
      const redisClient = new RedisClient()
      redisClient.createClient('test', {
        host: 'localhost',
        port: 6379
      })
      expect(typeof redisClient['bucket']['test'] === 'object').toBe(true)
    })

    it('does not creates new client the name is exists', function() {
      const redisClient = new RedisClient()
      redisClient.createClient('default', {
        host: 'localhost',
        port: 6379
      })
      expect(redisClient.getCurrentClient()).toEqual('default')
      expect(typeof redisClient['bucket']['test'] === 'undefined').toBe(true)
    })

    it('always return created/existing client', function() {
      const redisClient = new RedisClient()
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
      const redisClient = new RedisClient()
      redisClient.createClient('test', {
        host: 'localhost',
        port: 6379
      })
      expect(redisClient.useClient('test').getCurrentClient()).toEqual('test')
      expect(redisClient.useClient('default').getCurrentClient()).toEqual('default')
    })

    it('throws an Error if the name is not in bucket list', function() {
      const redisClient = new RedisClient()
      try {
        redisClient.useClient('test')
      } catch (error) {
        expect(error.message).toEqual('RedisClient "test" is not found')
        return
      }
      expect('should not reach this line').toEqual('hm')
    })
  })

  describe('.getClient()', function() {
    it('returns native redis client if name exists', function() {
      const redisClient = new RedisClient()
      redisClient.createClient('test', {
        host: 'localhost',
        port: 6379
      })
      expect(redisClient.getClient('test') === redisClient['bucket']['test']).toBe(true)
    })

    it('throws an Error if the name is not in bucket list', function() {
      const redisClient = new RedisClient()
      try {
        redisClient.getClient('test')
      } catch (error) {
        expect(error.message).toEqual('RedisClient "test" is not found')
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
      const redisClient = new RedisClient()
      expect(redisClient.hasClient('default')).toBe(true)
      expect(redisClient.hasClient('test')).toBe(false)
    })
  })

  describe('protected .redisClientProxy()', function() {
    it('simply calls RedisClient.prototype[method] with custom callback', function() {
      const redisStub = Sinon.stub(Redis.RedisClient.prototype, 'get')
      const redisClient = new RedisClient()
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
      const redisClient = new RedisClient()
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
        const redisClient = new RedisClient()
        const redisClientProxyStub = Sinon.stub(redisClient, <any>'redisClientProxy')
        redisClientProxyStub.callsFake(async function() {})
        expect(isPromise(redisClient[facadeMethod](...args))).toBe(true)
        redisClientProxyStub.restore()
      })

      it('calls .redisClientProxy(), passes method name and arguments', async function() {
        const redisClient = new RedisClient()
        const redisClientProxyStub = Sinon.stub(redisClient, <any>'redisClientProxy')
        redisClientProxyStub.callsFake(async function() {
          return true
        })
        redisClient[facadeMethod](...args)
        expect(redisClientProxyStub.calledWith(redisMethod)).toBe(true)
        expect(Array.from(redisClientProxyStub.lastCall.args[1])).toEqual(args)
      })
    })
  }

  redisClientProxy_test_for('append', 'append', ['test', 'abc'])

  redisClientProxy_test_for('auth', 'auth', ['password'])

  redisClientProxy_test_for('bgRewriteAOF', 'bgrewriteaof', [])

  redisClientProxy_test_for('bgSave', 'bgsave', [])

  redisClientProxy_test_for('bitCount', 'bitcount', ['test'])
  redisClientProxy_test_for('bitCount', 'bitcount', ['test', 1, 2])

  redisClientProxy_test_for('bitField', 'bitfield', ['test', 1])
  redisClientProxy_test_for('bitField', 'bitfield', ['test', [1]])
  redisClientProxy_test_for('bitField', 'bitfield', ['test', ['test']])
})
