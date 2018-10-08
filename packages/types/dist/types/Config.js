"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var t = __importStar(require("runtypes"));
var validateParams_1 = __importDefault(require("../lib/validateParams"));
var PresetConfig_1 = __importDefault(require("./PresetConfig"));
var Source_1 = __importDefault(require("./Source"));
var Storage_1 = __importDefault(require("./Storage"));
// Test to make sure :preset exists in path.
var pattern = /^\/.*:preset(\([^)]+\))?([^\w)]*?$|\/.*)/i;
var Config = t.Record({
    paths: t.Array(t.String
        .withConstraint(function (n) { return !!n || 'Cannot be empty'; })
        .withConstraint(function (n) { return /^\//.test(n) || 'Must start with /'; })
        .withConstraint(function (n) { return pattern.test(n) || 'Requires :preset in path'; })).withConstraint(function (n) { return n && n.length > 0 || 'Requires at least one path'; }),
    sources: t.Array(Source_1.default),
    presets: t.Dictionary(PresetConfig_1.default, 'string'),
}).And(t.Partial({
    storage: Storage_1.default,
    disableChunkedEncoding: t.Boolean,
})).withConstraint(validateParams_1.default);
exports.default = Config;
