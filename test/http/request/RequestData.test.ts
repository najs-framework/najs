import 'jest'
import * as Sinon from 'sinon'
import { RequestData } from '../../../lib/http/request/RequestData'

describe('RequestData', function() {
  describe('.constructor()', function() {
    it('is constructed by an Object data', function() {
      const data = {}
      const requestData = new RequestData(data)
      expect(requestData['data'] === data).toBe(true)
    })
  })

  describe('.all()', function() {
    it('returns raw data which passed to constructor before', function() {
      const data = {}
      const requestData = new RequestData(data)
      expect(requestData.all() === data).toBe(true)
    })
  })

  describe('.has()', function() {
    it('uses Object.prototype.hasOwnProperty() to determine the key exists or not', function() {
      const requestData = new RequestData({})
      const hasOwnPropertySpy = Sinon.spy(requestData['data'], 'hasOwnProperty')
      requestData.has('test')
      expect(hasOwnPropertySpy.calledWith('test')).toBe(true)
    })

    it('returns true if key has value undefined', function() {
      const requestData = new RequestData({ key: undefined })
      expect(requestData.has('key')).toBe(true)
      expect(requestData.has('test')).toBe(false)
    })
  })

  describe('.get()', function() {
    it('returns data[name] if there is no default value', function() {
      const requestData = new RequestData({ test: 'any' })
      expect(requestData.get('test')).toEqual('any')
      expect(requestData.get('not-found')).toBeUndefined()
    })

    it('returns defaultValue if defaultValue passed and and data[name] is "falsy" value', function() {
      const requestData = new RequestData({ test: 'any', keyUndefined: undefined, keyEmpty: '', keyFalse: false })
      expect(requestData.get('test', 'something')).toEqual('any')
      expect(requestData.get('keyUndefined', 'default')).toEqual('default')
      expect(requestData.get('keyEmpty', 'default')).toEqual('default')
      expect(requestData.get('keyFalse', 'default')).toEqual('default')
      expect(requestData.get('keyNotFound', 'default')).toEqual('default')
    })
  })

  describe('.only()', function() {
    it('should be immutable', function() {
      const requestData = new RequestData({})
      expect(requestData.only('a') === requestData.all()).toBe(false)
    })

    it('returns fresh object with keys passed in arguments', function() {
      const requestData = new RequestData({ a: 'a', b: undefined, c: 1, d: true, e: false, f: {}, g: [] })
      expect(requestData.only('a')).toEqual({ a: 'a' })
      expect(requestData.only('a', 'b')).toEqual({ a: 'a', b: undefined })
      expect(requestData.only(['a', 'b', 'c'])).toEqual({ a: 'a', b: undefined, c: 1 })
      expect(requestData.only('a', ['b', 'c'], 'd', 'e')).toEqual({ a: 'a', b: undefined, c: 1, d: true, e: false })
    })
  })
  describe('.except()', function() {
    it('should be immutable', function() {
      const requestData = new RequestData({})
      expect(requestData.except('a') === requestData.all()).toBe(false)
    })

    it('returns fresh object with keys not passed in arguments', function() {
      const requestData = new RequestData({ a: 'a', b: undefined, c: 1, d: true, e: false, f: {}, g: [] })
      expect(requestData.except('a')).toEqual({ b: undefined, c: 1, d: true, e: false, f: {}, g: [] })
      expect(requestData.except('a', 'b')).toEqual({ c: 1, d: true, e: false, f: {}, g: [] })
      expect(requestData.except(['a', 'b', 'c'])).toEqual({ d: true, e: false, f: {}, g: [] })
      expect(requestData.except('a', ['b', 'c'], 'd', 'e')).toEqual({ f: {}, g: [] })
    })
  })
})
