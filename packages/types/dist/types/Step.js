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
var types_1 = __importDefault(require("../operations/compress/types"));
var types_2 = __importDefault(require("../operations/crop/types"));
var types_3 = __importDefault(require("../operations/fill/types"));
var types_4 = __importDefault(require("../operations/fit/types"));
var types_5 = __importDefault(require("../operations/format/types"));
var types_6 = __importDefault(require("../operations/resize/types"));
var types_7 = __importDefault(require("../operations/strip/types"));
var Step = t.Partial({
    $compress: types_1.default,
    $crop: types_2.default,
    $fill: types_3.default,
    $fit: types_4.default,
    $format: types_5.default,
    $resize: types_6.default,
    $strip: types_7.default,
}).withConstraint(function (n) {
    if (Object.keys(n).length > 1) {
        return 'please only one operation per step';
    }
    if (Object.keys(n).length === 0) {
        return 'please no empty step';
    }
    return true;
});
exports.default = Step;
