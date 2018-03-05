import 'jest'
import * as Sinon from 'sinon'
import { CookieHandlebarsHelper } from '../../../../lib/view/handlebars/helpers/CookieHandlebarsHelper'

describe('CookieHandlebarsHelper', function() {
  it('implements IAutoload interface', function() {
    const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
    expect(helper.getClassName()).toEqual('Najs.CookieHandlebarsHelper')
  })

  describe('BlockHelper: {{#Cookie ...}} body {{/Cookie}}', function() {
    it('does nothing if the controller not found, return undefined', function() {
      const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
      const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
      isBlockHelperStub.returns(true)

      expect(helper.run('test')).toBeUndefined()

      isBlockHelperStub.restore()
    })

    it('does nothing if cookie in the controller not found, return undefined', function() {
      const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
      helper['controller'] = <any>{}
      const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
      isBlockHelperStub.returns(true)

      expect(helper.run('test')).toBeUndefined()

      isBlockHelperStub.restore()
    })

    it('proxies "has" function if it is a block helper', function() {})

    it('calls .renderChildren() if has key in cookie', function() {
      const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
      const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
      isBlockHelperStub.returns(true)

      helper['property'] = 'cookie'
      helper['controller'] = <any>{
        cookie: {
          has() {
            return true
          }
        }
      }
      const renderChildrenStub = Sinon.stub(helper, 'renderChildren')

      expect(helper.run('test')).toBeUndefined()
      expect(renderChildrenStub.called).toBe(true)

      isBlockHelperStub.restore()
      renderChildrenStub.restore()
    })

    it('returns undefined if has no key in cookie (or body/query/params)', function() {
      const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
      const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
      isBlockHelperStub.returns(true)

      helper['controller'] = <any>{
        cookie: {
          has() {
            return false
          }
        }
      }
      const renderChildrenStub = Sinon.stub(helper, 'renderChildren')

      expect(helper.run('test')).toBeUndefined()
      expect(renderChildrenStub.called).toBe(false)

      isBlockHelperStub.restore()
      renderChildrenStub.restore()
    })
  })

  describe('Helper: {{Cookie ...}}', function() {
    it('does nothing if the controller not found, return empty string', function() {
      const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
      const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
      isBlockHelperStub.returns(false)

      expect(helper.run('test')).toEqual('')

      isBlockHelperStub.restore()
    })

    it('does nothing if the controller not found, return empty string', function() {
      const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
      helper['controller'] = <any>{}
      const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
      isBlockHelperStub.returns(false)

      expect(helper.run('test')).toEqual('')

      isBlockHelperStub.restore()
    })

    const returnSomethingActions = ['all', 'has', 'exists', 'except', 'only']
    for (const action of returnSomethingActions) {
      describe('{{Cookie ' + action + ' ...}}', function() {
        it('proxies "' + action + '" returns the result', function() {
          const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
          const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
          isBlockHelperStub.returns(false)

          const cookie = {
            [action]: function() {
              return 'anything'
            }
          }

          helper['controller'] = <any>{
            cookie
          }
          const actionSpy = Sinon.spy((helper['controller'] as any)['cookie'], action)

          expect(helper.run(action)).toEqual('anything')
          expect(actionSpy.calledWith()).toBe(true)
          expect(actionSpy.lastCall.thisValue === cookie).toBe(true)

          expect(helper.run(action, 'first')).toEqual('anything')
          expect(actionSpy.calledWith('first')).toBe(true)
          expect(actionSpy.lastCall.thisValue === cookie).toBe(true)

          expect(helper.run(action, 'first', 'second')).toEqual('anything')
          expect(actionSpy.calledWith('first', 'second')).toBe(true)
          expect(actionSpy.lastCall.thisValue === cookie).toBe(true)

          expect(helper.run(action, 'first', 'second', 'third')).toEqual('anything')
          expect(actionSpy.calledWith('first', 'second', 'third')).toBe(true)
          expect(actionSpy.lastCall.thisValue === cookie).toBe(true)

          expect(helper.run(action, 'first', ['second', 'third'])).toEqual('anything')
          expect(actionSpy.calledWith('first', ['second', 'third'])).toBe(true)
          expect(actionSpy.lastCall.thisValue === cookie).toBe(true)

          isBlockHelperStub.restore()
          actionSpy.restore()
        })
      })
    }

    describe('{{Cookie get [key]}}', function() {
      it('proxies "get" returns the result', function() {
        const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
        const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
        isBlockHelperStub.returns(false)

        const cookie = {
          get() {
            return 'anything'
          }
        }

        helper['property'] = 'cookie'
        helper['controller'] = <any>{
          cookie
        }
        const actionSpy = Sinon.spy((helper['controller'] as any)['cookie'], 'get')

        expect(helper.run('get', 'something', {})).toEqual('anything')
        expect(actionSpy.calledWith('something')).toBe(true)
        expect(actionSpy.lastCall.thisValue === cookie).toBe(true)
        isBlockHelperStub.restore()
        actionSpy.restore()
      })
    })

    describe('{{Cookie [key]}}', function() {
      it('proxies "get" returns the result', function() {
        const helper: CookieHandlebarsHelper = Reflect.construct(CookieHandlebarsHelper, [])
        const isBlockHelperStub = Sinon.stub(helper, 'isBlockHelper')
        isBlockHelperStub.returns(false)

        const cookie = {
          get() {
            return 'anything'
          }
        }

        helper['property'] = 'cookie'
        helper['controller'] = <any>{
          cookie
        }
        const actionSpy = Sinon.spy((helper['controller'] as any)['cookie'], 'get')

        expect(helper.run('something', {})).toEqual('anything')
        expect(actionSpy.calledWith('something')).toBe(true)
        expect(actionSpy.lastCall.thisValue === cookie).toBe(true)
        isBlockHelperStub.restore()
        actionSpy.restore()
      })
    })
  })
})
