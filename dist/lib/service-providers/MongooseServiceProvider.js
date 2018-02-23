"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../constants");
const ConfigFacade_1 = require("./../facades/global/ConfigFacade");
const ServiceProvider_1 = require("../core/ServiceProvider");
const register_1 = require("../core/register");
const bind_1 = require("../core/bind");
const mongoose = require('mongoose');
class MongooseServiceProvider extends ServiceProvider_1.ServiceProvider {
    getClassName() {
        return MongooseServiceProvider.className;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose.model(modelName, schema);
    }
    async boot() {
        return new Promise(resolve => {
            mongoose.connect(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Mongoose, 'mongodb://localhost:27017/najs'), ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.MongooseOptions, {}));
            mongoose.connection.once('open', resolve);
        });
    }
}
MongooseServiceProvider.className = 'Najs.MongooseDriverServiceProvider';
exports.MongooseServiceProvider = MongooseServiceProvider;
register_1.register(MongooseServiceProvider);
bind_1.bind('MongooseProvider', MongooseServiceProvider.className);
