import 'jest'
import { Route } from '../../../lib/http/routing/Route'
import { RouteCollection } from '../../../lib/http/routing/RouteCollection'

describe('RouteCollection', function() {
  it('is initialized with isChanged = false and empty routes, routeData', function() {
    expect(RouteCollection['isChanged']).toBe(false)
    expect(RouteCollection['routes']).toEqual([])
    expect(RouteCollection['routeData']).toEqual([])
  })

  it('sets isChanged to true whenever register() get called', function() {
    expect(RouteCollection['isChanged']).toBe(false)
    Route.group(function() {})
    expect(RouteCollection['isChanged']).toBe(true)
  })

  it('sets isChanged to false whenever getData() get called', function() {
    RouteCollection['isChanged'] = true
    RouteCollection.getData()
    expect(RouteCollection['isChanged']).toBe(false)
  })

  it('rebuilds fresh instance of data if isChanged = true', function() {
    Route.get('/test', 'Controller@endpoint')
    const dataFirstCall = RouteCollection.getData()
    const routeDataPointerFirstCall = RouteCollection['routeData']
    const routeDataNamedPointerFirstCall = RouteCollection['routeDataNamed']

    RouteCollection['isChanged'] = true

    const dataSecondCall = RouteCollection.getData()
    const routeDataPointerSecondCall = RouteCollection['routeData']
    const routeDataNamedPointerSecondCall = RouteCollection['routeDataNamed']

    expect(dataFirstCall === dataSecondCall).toBe(false)
    expect(routeDataPointerFirstCall === routeDataPointerSecondCall).toBe(false)
    expect(routeDataNamedPointerFirstCall === routeDataNamedPointerSecondCall).toBe(false)
  })

  it('never rebuilds data if isChanged = false', function() {
    Route.get('/test', 'Controller@endpoint')
    const dataFirstCall = RouteCollection.getData()
    const routeDataPointerFirstCall = RouteCollection['routeData']
    const routeDataNamedPointerFirstCall = RouteCollection['routeDataNamed']

    const dataSecondCall = RouteCollection.getData()
    const routeDataPointerSecondCall = RouteCollection['routeData']
    const routeDataNamedPointerSecondCall = RouteCollection['routeDataNamed']

    expect(dataFirstCall === dataSecondCall).toBe(true)
    expect(routeDataPointerFirstCall === routeDataPointerSecondCall).toBe(true)
    expect(routeDataNamedPointerFirstCall === routeDataNamedPointerSecondCall).toBe(true)
  })

  it('created routeDataNamed hash object for named routes, .hasName() use for check the named route exists or not', function() {
    RouteCollection['routes'] = []
    expect(RouteCollection.hasName('named')).toBe(false)
    Route.get('/test', 'Controller@endpoint')
    Route.post('/test', 'Controller@endpoint').name('named')
    expect(RouteCollection.getData()).toHaveLength(2)
    expect(RouteCollection['routeDataNamed']).toEqual({
      named: {
        name: 'named',
        method: 'POST',
        path: '/test',
        prefix: '',
        middleware: [],
        controller: 'Controller',
        endpoint: 'endpoint'
      }
    })
    expect(RouteCollection.hasName('named')).toBe(true)
    expect(RouteCollection.hasName('not-found')).toBe(false)
  })
})
