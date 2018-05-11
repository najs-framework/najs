"use strict";
/// <reference path="../../../contracts/HttpDriver.ts" />
/// <reference path="../../../contracts/types/http.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class RouteMiddlewareUtil {
    static getMiddlewareListOfRoute(route, httpKernel) {
        const middlewareListBag = route.middleware
            .filter(function (middleware) {
            return !lodash_1.isFunction(middleware);
        })
            .map(middleware => {
            return this.getMiddlewareList(httpKernel, middleware);
        });
        return Array.from(new Set(lodash_1.flatten(middlewareListBag)));
    }
    static getMiddlewareList(httpKernel, middleware) {
        if (lodash_1.isString(middleware)) {
            return httpKernel.getMiddleware(middleware);
        }
        if (lodash_1.isObject(middleware)) {
            return [middleware];
        }
        return [];
    }
    static createNativeMiddlewareHandlers(middlewareList, driver) {
        const result = middlewareList
            .filter(function (middleware) {
            return lodash_1.isFunction(middleware.native);
        })
            .reduce(function (memo, middleware) {
            const native = Reflect.apply(middleware.native, middleware, [driver]);
            if (!native) {
                return memo;
            }
            const items = Array.isArray(native) ? native : [native];
            memo.push(items.filter(item => lodash_1.isFunction(item)));
            return memo;
        }, []);
        return Array.from(new Set(lodash_1.flatten(result)));
    }
    static async applyBeforeMiddleware(middlewareList, request, response, controller) {
        if (middlewareList.length === 0) {
            return;
        }
        for (const middleware of middlewareList) {
            if (lodash_1.isFunction(middleware.before)) {
                await Reflect.apply(middleware.before, middleware, [request, response, controller]);
            }
        }
    }
    static async applyAfterMiddleware(middlewareList, request, response, value, controller) {
        if (middlewareList.length === 0) {
            return value;
        }
        let result = value;
        for (const middleware of middlewareList) {
            if (lodash_1.isFunction(middleware.after)) {
                result = await Reflect.apply(middleware.after, middleware, [request, response, result, controller]);
            }
        }
        return result;
    }
}
exports.RouteMiddlewareUtil = RouteMiddlewareUtil;
