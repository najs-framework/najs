"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const JsonResponse_1 = require("../../../../lib/http/response/types/JsonResponse");
describe('JsonResponse', function () {
    it('can be created with any value', function () {
        const json = new JsonResponse_1.JsonResponse({ ok: true });
        expect(json['value']).toEqual({ ok: true });
    });
    it('calls IHttpDriver.respondJson and passes response, this.value', function () {
        const request = {};
        const response = {};
        const driver = { respondJson() { } };
        const respondJsonSpy = Sinon.spy(driver, 'respondJson');
        const json = new JsonResponse_1.JsonResponse('any');
        json.respond(request, response, driver);
        expect(respondJsonSpy.calledWith(response, 'any')).toBe(true);
    });
});
