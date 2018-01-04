"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RouteBuilder_1 = require("./RouteBuilder");
var RouteBuilderAdvance = /** @class */ (function (_super) {
    __extends(RouteBuilderAdvance, _super);
    function RouteBuilderAdvance(method, path) {
        var _this = _super.call(this, method, path) || this;
        _this.children = [];
        return _this;
    }
    RouteBuilderAdvance.prototype.getRouteData = function () {
        return this.data;
    };
    RouteBuilderAdvance.prototype.registerChildRoute = function (route) {
        if (this.children.length === 0) {
            this.children.push(route);
            return;
        }
        var lastChild = this.children[this.children.length - 1];
        if (lastChild.shouldRegisterChildRoute()) {
            lastChild.registerChildRoute(route);
            return;
        }
        this.children.push(route);
    };
    RouteBuilderAdvance.prototype.shouldRegisterChildRoute = function () {
        if (!this.data.metadata) {
            return false;
        }
        return this.data.metadata['grouped'] === true;
    };
    RouteBuilderAdvance.prototype.hasChildRoute = function () {
        return this.children.length === 0;
    };
    // -------------------------------------------------------------------------------------------------------------------
    RouteBuilderAdvance.prototype.middleware = function (middleware) {
        this.data.middleware.push(middleware);
        return this;
    };
    RouteBuilderAdvance.prototype.prefix = function (prefix) {
        this.data.prefix = prefix;
        return this;
    };
    RouteBuilderAdvance.prototype.get = function (path) {
        this.data.method = 'GET';
        this.data.path = path;
        return this;
    };
    RouteBuilderAdvance.prototype.post = function (path) {
        this.data.method = 'POST';
        this.data.path = path;
        return this;
    };
    RouteBuilderAdvance.prototype.group = function (callback) {
        if (!this.data.metadata) {
            this.data.metadata = {};
        }
        this.data.metadata['grouped'] = true;
        callback.call(undefined);
        delete this.data.metadata['grouped'];
    };
    return RouteBuilderAdvance;
}(RouteBuilder_1.RouteBuilder));
exports.RouteBuilderAdvance = RouteBuilderAdvance;
//# sourceMappingURL=RouteBuilderAdvance.js.map