"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tsyringe_1 = require("tsyringe");
const serverless_http_1 = __importDefault(require("serverless-http"));
const auth_1 = require("../../helpers/lib/auth");
const auth_router_1 = require("../../routes/auth-router");
const app = (0, auth_1.getApp)();
app.use('/auth', tsyringe_1.container.resolve(auth_router_1.AuthRouter).getRoutes());
const _handler = (0, serverless_http_1.default)(app);
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield _handler(event, context));
});
exports.handler = handler;
