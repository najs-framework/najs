"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const ConfigFacade_1 = require("../../lib/facades/global/ConfigFacade");
const Path_1 = require("../../lib/core/Path");
const SystemPath = require("path");
const Najs_1 = require("../../lib/core/Najs");
describe('Path', function () {
    describe('constructor()', function () {
        it('gets workingDirectory from Najs["cwd"]', function () {
            Najs_1.Najs['cwd'] = 'test';
            const path = new Path_1.Path();
            expect(path['workingDirectory']).toEqual('test');
        });
        it('sets workingDirectory to "" in case Najs["cwd"] is not set', function () {
            Najs_1.Najs['cwd'] = undefined;
            const path = new Path_1.Path();
            expect(path['workingDirectory']).toEqual('');
        });
    });
    describe('.get()', function () {
        it('resolve path based on this.workingDirectory', function () {
            const path = new Path_1.Path();
            path['workingDirectory'] = 'root';
            expect(path.get('any', 'thing')).toEqual(SystemPath.resolve('root', 'any', 'thing'));
        });
    });
    describe('.cwd()', function () {
        it('resolve path based on this.workingDirectory', function () {
            const path = new Path_1.Path();
            path['workingDirectory'] = 'root';
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
                path['workingDirectory'] = 'root';
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
