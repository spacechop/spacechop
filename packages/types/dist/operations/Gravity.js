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
var Gravity = t.Union(t.Literal('center'), t.Literal('face'), t.Literal('north'), t.Literal('northeast'), t.Literal('east'), t.Literal('southeast'), t.Literal('south'), t.Literal('southwest'), t.Literal('west'), t.Literal('northwest'));
exports.allGravities = Gravity.alternatives.map(function (f) { return f.value; });
exports.default = Gravity;
