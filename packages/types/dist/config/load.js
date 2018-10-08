"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
exports.loadConfig = function (filepath) { return js_yaml_1.default.safeLoad(fs_1.default.readFileSync(filepath)); };
exports.default = (function (filepath) {
    if (fs_1.default.existsSync(filepath)) {
        try {
            var config = exports.loadConfig(filepath);
            if (config) {
                return config;
            }
            else {
                throw new Error("Configuration is empty, " + filepath);
            }
        }
        catch (err) {
            throw new Error("Could not load " + filepath + ":\n\n" + err);
        }
    }
    else {
        throw new Error("Could not find " + filepath);
    }
});
