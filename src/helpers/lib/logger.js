"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const triple_beam_1 = require("triple-beam");
const winston_1 = __importStar(require("winston"));
const printer = winston_1.format.printf((Info) => `${Info.timestamp} ${Info[Symbol.for('level')].toUpperCase()} ${Info.fileName} - ${Info.message}`);
const errorFinder = (0, winston_1.format)((Info) => {
    if (Info.error) {
        return Info;
    }
    const splat = Info[triple_beam_1.SPLAT] || [];
    Info.error = splat.find((obj) => obj instanceof Error);
    return Info;
});
const errorFormatter = (0, winston_1.format)((Info) => {
    if (!Info.error) {
        return Info;
    }
    const errorMsg = Info.error.stack || Info.error.toString();
    Info.message += `\n${errorMsg}`;
    return Info;
});
const _logger = winston_1.default.createLogger({
    level: "debug",
    format: winston_1.format.combine(winston_1.format.colorize({ level: true }), winston_1.format.errors({ stack: true }), errorFinder(), errorFormatter(), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.splat(), printer),
    transports: [new winston_1.transports.Console()],
    exitOnError: false,
});
const createLogger = (loggerOption) => {
    return _logger.child(loggerOption);
};
exports.createLogger = createLogger;
