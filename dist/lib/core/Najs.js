"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NajsContainer {
    // config: IConfig
    // response: IResponse
    // logger: ILogger
    // schemaValidator: ISchemaValidator
    // cache: ICache
    workingDirectory(cwd) {
        this.cwd = cwd;
        return this;
    }
    classes(path) {
        return this;
    }
    providers(providers) {
        return this;
    }
    on(event, callback) {
        return this;
    }
    start() {
        return this;
    }
}
exports.NajsContainer = NajsContainer;
exports.Najs = new NajsContainer();
