"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApp = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const BASE_URLS = [];
const getApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)((req, callback) => {
        callback(null, {
            origin: BASE_URLS.includes(req.header("Origin"))
        });
    }));
    app.use((0, helmet_1.default)());
    app.use(body_parser_1.default.json({ strict: false }));
    return app;
};
exports.getApp = getApp;
