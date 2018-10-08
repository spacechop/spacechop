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
var ACL = t.Union(t.Literal('private'), t.Literal('public-read'), t.Literal('public-read-write'), t.Literal('authenticated-read'), t.Literal('aws-exec-read'), t.Literal('bucket-owner-read'), t.Literal('bucket-owner-full-control'));
var S3StorageConfig = t.Record({
    access_key_id: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    secret_access_key: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    region: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    bucket_name: t.String.withConstraint(function (n) { return n && n.length > 0; }),
    path: t.String,
}).And(t.Partial({
    ACL: ACL,
    endpoint: t.String,
}));
exports.default = S3StorageConfig;
