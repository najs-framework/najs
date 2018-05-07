"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const SystemPath = require("path");
const ConfigFacade_1 = require("../../lib/facades/global/ConfigFacade");
const Path_1 = require("../../lib/file-system/Path");
const Najs_1 = require("../../lib/core/Najs");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../lib/constants");
const najs_binding_1 = require("najs-binding");
describe('Path', function () {
    it('extends from Facade so it definitely a FacadeClass', function () {
        const path = new Path_1.Path();
        expect(path).toBeInstanceOf(najs_facade_1.Facade);
        expect(path.getClassName()).toEqual(constants_1.Najs.FileSystem.Path);
        expect(najs_binding_1.ClassRegistry.has(constants_1.Najs.FileSystem.Path)).toBe(true);
    });
    describe('.get()', function () {
        it('resolve path based on this.workingDirectory', function () {
            const path = new Path_1.Path();
            Najs_1.Najs['cwd'] = 'root';
            expect(path.get('any', 'thing')).toEqual(SystemPath.resolve('root', 'any', 'thing'));
        });
    });
    describe('.cwd()', function () {
        it('resolve path based on this.workingDirectory', function () {
            const path = new Path_1.Path();
            Najs_1.Najs['cwd'] = 'root';
            expect(path.cwd('any', 'thing')).toEqual(SystemPath.resolve('root', 'any', 'thing'));
        });
    });
    const najsPaths = {
        app: 'app',
        config: 'config',
        layout: SystemPath.join('resources', 'view', 'layout'),
        public: 'public',
        resource: 'resources',
        route: 'routes',
        storage: SystemPath.join('app', 'storage'),
        view: SystemPath.join('resources', 'view')
    };
    for (const name in najsPaths) {
        describe('.' + name + '()', function () {
            it('resolve path based on this.workingDirectory + config("ConfigurationKeys.Paths.' + name + '")', function () {
                const path = new Path_1.Path();
                Najs_1.Najs['cwd'] = 'root';
                ConfigFacade_1.ConfigFacade.createStub('get').returns('test');
                expect(path[name]('any')).toEqual(SystemPath.resolve('root', 'test', 'any'));
                expect(path[name]('any', 'thing')).toEqual(SystemPath.resolve('root', 'test', 'any', 'thing'));
                ConfigFacade_1.ConfigFacade.restoreFacade();
                ConfigFacade_1.ConfigFacade.createStub('has').returns(false);
                expect(path[name]('any')).toEqual(SystemPath.resolve('root', najsPaths[name], 'any'));
                expect(path[name]('any', 'thing')).toEqual(SystemPath.resolve('root', najsPaths[name], 'any', 'thing'));
                ConfigFacade_1.ConfigFacade.restoreFacade();
            });
        });
    }
});
