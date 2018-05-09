"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Config_1 = require("../../lib/config/Config");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../lib/constants");
const najs_binding_1 = require("najs-binding");
describe('Config', function () {
    it('extends from Facade so it definitely a FacadeClass', function () {
        const config = new Config_1.Config();
        expect(config).toBeInstanceOf(najs_facade_1.Facade);
        expect(config.getClassName()).toEqual('Najs.Config');
        expect(najs_binding_1.ClassRegistry.has(constants_1.Najs.Config)).toBe(true);
    });
    describe('.get()', function () {
        it('calls "config".get if there is no default value', function () {
            const fakeConfig = {
                get() { }
            };
            const config = new Config_1.Config();
            config['config'] = fakeConfig;
            const getSpy = Sinon.spy(fakeConfig, 'get');
            config.get('any');
            expect(getSpy.calledWith('any')).toBe(true);
        });
        it('returns defaultValue if provided and key not found', function () {
            const fakeConfig = {
                has() {
                    return false;
                },
                get() { }
            };
            const config = new Config_1.Config();
            config['config'] = fakeConfig;
            const getSpy = Sinon.spy(fakeConfig, 'get');
            expect(config.get('any', 'default')).toEqual('default');
            expect(getSpy.called).toBe(false);
        });
    });
    describe('.has()', function () {
        it('calls "config".has, the "config" contains Config instance from "config" library', function () {
            const fakeConfig = {
                has() { }
            };
            const config = new Config_1.Config();
            config['config'] = fakeConfig;
            const hasSpy = Sinon.spy(fakeConfig, 'has');
            config.has('any');
            expect(hasSpy.calledWith('any')).toBe(true);
        });
    });
});
