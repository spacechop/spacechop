"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = __importDefault(require("path-to-regexp"));
var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;
exports.default = (function (pattern) {
    if (!pattern) {
        throw new Error('Cant compile path. No pattern provided.');
    }
    if (cache[pattern]) {
        return cache[pattern];
    }
    var keys = [];
    path_to_regexp_1.default(pattern, keys);
    if (cacheCount < cacheLimit) {
        cache[pattern] = keys;
        cacheCount++;
    }
    return keys;
});
