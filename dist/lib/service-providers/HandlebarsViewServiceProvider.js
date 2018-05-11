"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../view/handlebars/HandlebarsViewResponse");
const constants_1 = require("../constants");
const ServiceProvider_1 = require("../core/ServiceProvider");
const Handlebars = require("handlebars");
const lodash_1 = require("lodash");
const HelperLoader = require('handlebars-helpers');
class HandlebarsViewServiceProvider extends ServiceProvider_1.ServiceProvider {
    getClassName() {
        return HandlebarsViewServiceProvider.className;
    }
    async register() {
        this.app.bind(constants_1.Najs.Http.Response.ViewResponse, constants_1.Najs.Http.Response.HandlebarsViewResponse);
    }
    static withHandlebarsHelpers(...args) {
        const packages = lodash_1.flatten(args);
        if (packages.length === 0) {
            // load all helpers
            Handlebars.registerHelper(HelperLoader());
        }
        else {
            // load helpers defined in packages
            Handlebars.registerHelper(HelperLoader(packages));
        }
        return this;
    }
}
HandlebarsViewServiceProvider.className = 'Najs.HandlebarsViewServiceProvider';
exports.HandlebarsViewServiceProvider = HandlebarsViewServiceProvider;
