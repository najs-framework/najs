import 'jest'
import * as Sinon from 'sinon'
import * as Lodash from 'lodash'
import { RequestDataWriter } from '../../../lib/http/request/RequestDataWriter'
import { RequestDataReader } from '../../../lib/http/request/RequestDataReader'

describe('RequestDataWriter', function() {
  it('extends RequestDataReader', function() {
    const writer = new RequestDataWriter({})
    expect(writer).toBeInstanceOf(RequestDataReader)
  })

  describe('.set()', function() {
    it('is chain-able', function() {
      const writer = new RequestDataWriter({})
      expect(writer.set('test', 'value') === writer).toBe(true)
    })

    it('uses Lodash.set() to set a value in this.data', function() {
      const setSpy = Sinon.spy(Lodash, 'set')
      const writer = new RequestDataWriter({})
      writer.set('test', 'value')
      expect(setSpy.calledWith(writer['data'], 'test', 'value')).toBe(true)
      setSpy.restore()
    })
  })

  describe('.put()', function() {
    it('is an alias of .set()', function() {
      const writer = new RequestDataWriter({})
      const setSpy = Sinon.spy(writer, 'set')
      writer.put('test', 'value')
      expect(setSpy.calledWith('test', 'value')).toBe(true)
      setSpy.restore()
    })
  })

  describe('.push()', function() {
    it('is an alias of .set()', function() {
      const writer = new RequestDataWriter({})
      const setSpy = Sinon.spy(writer, 'set')
      writer.push('test', 'value')
      expect(setSpy.calledWith('test', 'value')).toBe(true)
      setSpy.restore()
    })
  })

  describe('.pull()', function() {
    it('calls .get() to get data, calls .delete() to delete path and returns the value', function() {
      const writer = new RequestDataWriter({ a: 1, b: { c: 2, d: 3 } })
      const getSpy = Sinon.spy(writer, 'get')
      const deleteSpy = Sinon.spy(writer, 'delete')

      expect(writer.pull('a')).toEqual(1)
      expect(getSpy.calledWith('a')).toBe(true)
      expect(deleteSpy.calledWith('a')).toBe(true)
      expect(writer['data']).toEqual({ b: { c: 2, d: 3 } })

      expect(writer.pull('b.c')).toEqual(2)
      expect(getSpy.calledWith('b.c')).toBe(true)
      expect(deleteSpy.calledWith('b.c')).toBe(true)
      expect(writer['data']).toEqual({ b: { d: 3 } })

      expect(writer.pull('f', 4)).toEqual(4)
      expect(getSpy.calledWith('f', 4)).toBe(true)
      expect(deleteSpy.calledWith('f')).toBe(true)
      expect(writer['data']).toEqual({ b: { d: 3 } })
    })
  })

  describe('.delete()', function() {
    it('is chain-able', function() {
      const writer = new RequestDataWriter({})
      expect(writer.delete('test') === writer).toBe(true)
    })

    it('uses Lodash.unset() to delete a value in this.data', function() {
      const unsetSpy = Sinon.spy(Lodash, 'unset')
      const writer = new RequestDataWriter({})
      writer.delete('test')
      expect(unsetSpy.calledWith(writer['data'], 'test')).toBe(true)
      unsetSpy.restore()
    })
  })

  describe('.remove()', function() {
    it('is an alias of .delete()', function() {
      const writer = new RequestDataWriter({})
      const deleteSpy = Sinon.spy(writer, 'delete')
      writer.remove('test')
      expect(deleteSpy.calledWith('test')).toBe(true)
      deleteSpy.restore()
    })
  })

  describe('.forget()', function() {
    it('is an alias of .delete()', function() {
      const writer = new RequestDataWriter({})
      const deleteSpy = Sinon.spy(writer, 'delete')
      writer.forget('test')
      expect(deleteSpy.calledWith('test')).toBe(true)
      deleteSpy.restore()
    })
  })

  describe('.clear()', function() {
    it('is chain-able', function() {
      const writer = new RequestDataWriter({})
      expect(writer.clear() === writer).toBe(true)
    })

    it('set this.data to new Object', function() {
      const writer = new RequestDataWriter({ test: 0 })
      writer.clear()
      expect(writer['data']).toEqual({})
    })
  })

  describe('.flush()', function() {
    it('is an alias of .clear()', function() {
      const writer = new RequestDataWriter({})
      const clearSpy = Sinon.spy(writer, 'clear')
      writer.flush()
      expect(clearSpy.calledWith()).toBe(true)
      clearSpy.restore()
    })
  })
})
