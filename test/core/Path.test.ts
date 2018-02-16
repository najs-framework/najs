import 'jest'
import * as SystemPath from 'path'
import { ConfigFacade } from '../../lib/facades/global/ConfigFacade'
import { Path } from '../../lib/core/Path'
import { Najs } from '../../lib/core/Najs'
import { Facade } from '../../lib/facades/Facade'
import { GlobalFacadeClass } from '../../lib/constants'
import { ClassRegistry } from '../../lib/core/ClassRegistry'

describe('Path', function() {
  it('extends from Facade so it definitely a FacadeClass', function() {
    const path = new Path()
    expect(path).toBeInstanceOf(Facade)
    expect(path.getClassName()).toEqual(GlobalFacadeClass.Path)
    expect(ClassRegistry.has(GlobalFacadeClass.Path)).toBe(true)
  })

  describe('.get()', function() {
    it('resolve path based on this.workingDirectory', function() {
      const path = new Path()
      Najs['cwd'] = 'root'
      expect(path.get('any', 'thing')).toEqual(SystemPath.resolve('root', 'any', 'thing'))
    })
  })

  describe('.cwd()', function() {
    it('resolve path based on this.workingDirectory', function() {
      const path = new Path()
      Najs['cwd'] = 'root'
      expect(path.cwd('any', 'thing')).toEqual(SystemPath.resolve('root', 'any', 'thing'))
    })
  })

  const najsPaths = {
    app: 'app',
    config: 'config',
    layout: SystemPath.join('resources', 'view', 'layout'),
    public: 'public',
    resource: 'resources',
    route: 'routes',
    storage: SystemPath.join('app', 'storage'),
    view: SystemPath.join('resources', 'view')
  }
  for (const name in najsPaths) {
    describe('.' + name + '()', function() {
      it('resolve path based on this.workingDirectory + config("ConfigurationKeys.Paths.' + name + '")', function() {
        const path = new Path()
        Najs['cwd'] = 'root'

        ConfigFacade.createStub('get').returns('test')
        expect(path[name]('any')).toEqual(SystemPath.resolve('root', 'test', 'any'))
        expect(path[name]('any', 'thing')).toEqual(SystemPath.resolve('root', 'test', 'any', 'thing'))
        ConfigFacade.restoreFacade()

        ConfigFacade.createStub('has').returns(false)
        expect(path[name]('any')).toEqual(SystemPath.resolve('root', najsPaths[name], 'any'))
        expect(path[name]('any', 'thing')).toEqual(SystemPath.resolve('root', najsPaths[name], 'any', 'thing'))
        ConfigFacade.restoreFacade()
      })
    })
  }
})
