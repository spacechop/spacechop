"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var console_1 = __importDefault(require("../lib/console"));
var load_1 = __importDefault(require("./load"));
var validate_1 = __importDefault(require("./validate"));
exports.validate = validate_1.default;
var _a = process.env.CONFIG_PATH, CONFIG_PATH = _a === void 0 ? '/config.yml' : _a;
exports.default = (function (filename) {
    if (filename === void 0) { filename = CONFIG_PATH; }
    try {
        var config = load_1.default(filename);
        if (config && validate_1.default(config)) {
            return config;
        }
    }
    catch (err) {
        console_1.default.info(err);
    }
    return null;
});
