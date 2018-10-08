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
var Param_1 = __importDefault(require("../../types/Param"));
var PositiveNumber_1 = __importDefault(require("../PositiveNumber"));
var FitConfig = t.Partial({
    width: t.Union(PositiveNumber_1.default, Param_1.default),
    height: t.Union(PositiveNumber_1.default, Param_1.default),
}).withConstraint(function (n) {
    if (!(n.width || n.height)) {
        return 'missing width or height';
    }
    return true;
});
exports.default = FitConfig;
