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
var Format_1 = __importDefault(require("../../types/Format"));
var Param_1 = __importDefault(require("../../types/Param"));
var FormatConfig = t.Record({
    type: t.Union(Format_1.default, Param_1.default),
});
exports.default = FormatConfig;
