"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var t = __importStar(require("runtypes"));
var pattern = /^\/.*/i;
var VolumeSourceConfig = t.Record({
    root: t.String.withConstraint(function (n) { return (n && n.length > 0 && pattern.test(n)) || 'Requires valid root'; }),
});
exports.default = VolumeSourceConfig;
