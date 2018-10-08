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
var Format = t.Union(t.Literal('jpeg'), t.Literal('png'), t.Literal('gif'), t.Literal('webp'));
var Mime = t.Union(t.Literal('image/jpeg'), t.Literal('image/png'), t.Literal('image/gif'), t.Literal('image/webp'));
exports.allFormats = Format.alternatives.map(function (f) { return f.value; });
exports.allMimes = Mime.alternatives.map(function (f) { return f.value; });
exports.formatToMime = function (format) {
    var typedFormat = Format.check(format);
    var mime = ('image/' + typedFormat);
    return mime;
};
exports.mimeToFormat = function (mime) {
    var typedMime = Mime.check(mime);
    var type = typedMime.match(/^image\/(\w+)$/)[1];
    return type;
};
exports.parseFormat = function (value) {
    switch (value) {
        case 'jpg':
            return 'jpeg';
        default:
            return value in exports.allFormats ? value : null;
    }
};
exports.default = Format;
