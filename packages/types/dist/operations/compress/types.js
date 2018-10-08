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
var CompressConfig = t.Partial({
    quality: t.Number.withConstraint(function (n) {
        if (n < 0 || n > 100) {
            return 'quality must be between 0 and 100';
        }
        if (n % 1 !== 0) {
            return 'quality must be non decimal number';
        }
        return true;
    }),
    lossy: t.Boolean,
});
exports.default = CompressConfig;
