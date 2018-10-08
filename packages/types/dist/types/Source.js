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
var types_1 = __importDefault(require("../sources/http/types"));
var types_2 = __importDefault(require("./../sources/s3/types"));
var types_3 = __importDefault(require("./../sources/volume/types"));
var Source = t.Union(t.Record({ http: types_1.default }), t.Record({ s3: types_2.default }), t.Record({ volume: types_3.default }));
exports.default = Source;
