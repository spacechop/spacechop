"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var extractPathParams_1 = __importDefault(require("./extractPathParams"));
exports.default = (function (config) {
    var errors = [];
    var paths = config.paths, sources = config.sources, presets = config.presets, storage = config.storage;
    // Extract path params.
    var params = {};
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var path = paths_1[_i];
        for (var _a = 0, _b = extractPathParams_1.default(path); _a < _b.length; _a++) {
            var param = _b[_a];
            // Skip numerically indexed params to allow non capturing groups.
            if (!/^[\d]+$/.test('' + param.name)) {
                params[param.name] = 0;
            }
        }
    }
    // Validate params in sources.
    for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        var name_1 = Object.keys(source)[0];
        for (var _c = 0, _d = Object.keys(source[name_1]); _c < _d.length; _c++) {
            var key = _d[_c];
            if (source[name_1][key].length > 0) {
                var sourceParams = extractPathParams_1.default(source[name_1][key]);
                if (key === 'path' && sourceParams.length === 0) {
                    errors.push("storage." + name_1 + "." + key + ": Missing path parameters");
                }
                else {
                    for (var _e = 0, sourceParams_1 = sourceParams; _e < sourceParams_1.length; _e++) {
                        var param = sourceParams_1[_e];
                        if (typeof params[param.name] !== 'number') {
                            errors.push("source[" + i + "]." + name_1 + "." + key + ": Missing param \"" + param.name + "\" in paths");
                        }
                        else {
                            params[param.name]++;
                        }
                    }
                }
            }
            else if (key === 'path') {
                errors.push("source[" + i + "]." + name_1 + "." + key + ": Path cannot be empty");
            }
        }
    }
    // Validate params in storage.
    if (storage) {
        for (var _f = 0, _g = Object.keys(storage); _f < _g.length; _f++) {
            var name_2 = _g[_f];
            var store = storage[name_2];
            for (var _h = 0, _j = Object.keys(store); _h < _j.length; _h++) {
                var key = _j[_h];
                if (store[key].length > 0) {
                    var storeParams = extractPathParams_1.default(store[key]);
                    var filteredParams = storeParams.filter(function (param) { return param.name !== 'preset'; });
                    if (key === 'path' && filteredParams.length === 0) {
                        errors.push("storage." + name_2 + "." + key + ": Missing path parameters");
                    }
                    else {
                        for (var _k = 0, storeParams_1 = storeParams; _k < storeParams_1.length; _k++) {
                            var param = storeParams_1[_k];
                            if (typeof params[param.name] !== 'number') {
                                errors.push("storage." + name_2 + "." + key + ": Missing param \"" + param.name + "\" in paths");
                            }
                            else {
                                params[param.name]++;
                            }
                        }
                    }
                }
                else if (key === 'path') {
                    errors.push("storage." + name_2 + "." + key + ": Path cannot be empty");
                }
            }
        }
    }
    // Validate params in preset steps.
    for (var _l = 0, _m = Object.keys(presets); _l < _m.length; _l++) {
        var preset = _m[_l];
        for (var i = 0; i < presets[preset].steps.length; i++) {
            var step = presets[preset].steps[i];
            var operation = Object.keys(step)[0];
            for (var _o = 0, _p = Object.keys(step[operation]); _o < _p.length; _o++) {
                var key = _p[_o];
                var value = step[operation][key];
                if (typeof value === 'object' && 'from_path' in value) {
                    if (typeof params[value.from_path] !== 'number') {
                        errors.push("presets." + preset + ".steps[" + i + "]." + key
                            + (": Missing param (" + value.from_path + ") in paths for preset (" + preset + ")"));
                    }
                    else {
                        params[value.from_path]++;
                    }
                }
            }
        }
    }
    // For all params defined check usage.
    for (var _q = 0, _r = Object.keys(params); _q < _r.length; _q++) {
        var param = _r[_q];
        switch (param) {
            // ignore preset
            case 'preset':
                break;
            default:
                if (params[param] === 0) {
                    errors.push("params." + param + ": Could not find any usage in sources, storage or paths");
                }
        }
    }
    if (errors.length > 0) {
        return errors.join('\n');
    }
    return true;
});
