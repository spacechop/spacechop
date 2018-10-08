"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var console_1 = __importDefault(require("../lib/console"));
var Config_1 = __importDefault(require("../types/Config"));
exports.validate = function (config) {
    try {
        Config_1.default.check(config);
    }
    catch (err) {
        throw new Error("" + (err.key ? err.key + ": " : '') + err.message);
    }
};
var valid = true;
exports.default = (function (config, throwError) {
    if (throwError === void 0) { throwError = false; }
    try {
        exports.validate(config);
        if (!valid) {
            valid = true;
            console_1.default.info('Config is valid again');
        }
        return true;
    }
    catch (err) {
        valid = false;
        console_1.default.error('\nThere is an error in /config.yml:');
        console_1.default.error('--------------------------------');
        console_1.default.error(err.message);
        console_1.default.error('--------------------------------');
        if (throwError) {
            throw new Error(err);
        }
    }
    return false;
});
