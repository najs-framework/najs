import 'jest'
import * as Sinon from 'sinon'
import * as Lodash from 'lodash'
import { RequestDataReader } from '../../../lib/http/request/RequestDataReader'

describe('RequestDataReader', function() {
  describe('.constructor()', function() {
    it('is constructed by an Object data', function() {
      const data = {}
      const requestData = new RequestDataReader(data)
      expect(requestData['data'] === data).toBe(true)
    })
  })

  describe('.all()', function() {
    it('returns raw data which passed to constructor before', function() {
      const data = {}
      const requestData = new RequestDataReader(data)
      expect(requestData.all() === data).toBe(true)
    })
  })

  describe('.has()', function() {
    it('returns true if the item is present and is not falsy values', function() {
      const requestData = new RequestDataReader({
        a: 0,
        b: 1,
        c: '',
        d: 'd',
        e: undefined,
        // tslint:disable-next-line
        f: null,
        g: false,
        h: true
      })
      expect(requestData.has('a')).toBe(false)
      expect(requestData.has('b')).toBe(true)
      expect(requestData.has('c')).toBe(false)
      expect(requestData.has('d')).toBe(true)
      expect(requestData.has('e')).toBe(false)
      expect(requestData.has('f')).toBe(false)
      expect(requestData.has('g')).toBe(false)
      expect(requestData.has('h')).toBe(true)
    })
  })

  describe('.exists()', function() {
    it('uses Lodash.has() to determine the path exists in this.data', function() {
      const requestData = new RequestDataReader({})
      const hasSpy = Sinon.spy(Lodash, 'has')
      requestData.exists('test')
      expect(hasSpy.calledWith(requestData['data'], 'test')).toBe(true)
    })

    it('returns true if the item is present', function() {
      const requestData = new RequestDataReader({
        a: 0,
        b: 1,
        c: '',
        d: 'd',
        e: undefined,
        // tslint:disable-next-line
        f: null,
        g: false,
        h: true
      })
      expect(requestData.exists('a')).toBe(true)
      expect(requestData.exists('b')).toBe(true)
      expect(requestData.exists('c')).toBe(true)
      expect(requestData.exists('d')).toBe(true)
      expect(requestData.exists('e')).toBe(true)
      expect(requestData.exists('f')).toBe(true)
      expect(requestData.exists('g')).toBe(true)
      expect(requestData.exists('h')).toBe(true)
    })
  })

  describe('.get()', function() {
    it('uses Lodash.get() to get a value in this.data', function() {
      const requestData = new RequestDataReader({})
      const getSpy = Sinon.spy(Lodash, 'get')
      requestData.get('test')
      expect(getSpy.calledWith(requestData['data'], 'test')).toBe(true)
    })
  })

  describe('.only()', function() {
    it('should be immutable', function() {
      const requestData = new RequestDataReader({})
      expect(requestData.only('a') === requestData.all()).toBe(false)
    })

    it('returns fresh object with keys passed in arguments', function() {
      const requestData = new RequestDataReader({
        a: 'a',
        b: undefined,
        c: 1,
        d: true,
        e: false,
        f: { a: 1, b: 2 },
        g: []
      })
      expect(requestData.only('a')).toEqual({ a: 'a' })
      expect(requestData.only('a', 'b')).toEqual({ a: 'a', b: undefined })
      expect(requestData.only(['a', 'b', 'c'])).toEqual({ a: 'a', b: undefined, c: 1 })
      expect(requestData.only('a', ['b', 'c'], 'd', 'f')).toEqual({
        a: 'a',
        b: undefined,
        c: 1,
        d: true,
        f: { a: 1, b: 2 }
      })
      expect(requestData.only('a', ['b', 'c'], 'd', 'f.a')).toEqual({
        a: 'a',
        b: undefined,
        c: 1,
        d: true,
        f: { a: 1 }
      })
    })
  })

  describe('.except()', function() {
    it('should be immutable', function() {
      const requestData = new RequestDataReader({})
      expect(requestData.except('a') === requestData.all()).toBe(false)
    })

    it('returns fresh object with keys not passed in arguments', function() {
      const requestData = new RequestDataReader({
        a: 'a',
        b: undefined,
        c: 1,
        d: true,
        e: false,
        f: { a: 1, b: 2 },
        g: []
      })
      expect(requestData.except('a')).toEqual({ b: undefined, c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] })
      expect(requestData.except('a', 'b')).toEqual({ c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] })
      expect(requestData.except(['a', 'b', 'c'])).toEqual({ d: true, e: false, f: { a: 1, b: 2 }, g: [] })
      expect(requestData.except('a', ['b', 'c'], 'd', 'f')).toEqual({ e: false, g: [] })
      expect(requestData.except('a', ['b', 'c'], 'd', 'f.a')).toEqual({ e: false, f: { b: 2 }, g: [] })
    })
  })
})
