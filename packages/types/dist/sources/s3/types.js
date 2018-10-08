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
var S3SourceConfig = t.Record({
    access_key_id: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    secret_access_key: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    region: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    bucket_name: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    path: t.String,
}).And(t.Partial({
    endpoint: t.String,
}));
exports.default = S3SourceConfig;
