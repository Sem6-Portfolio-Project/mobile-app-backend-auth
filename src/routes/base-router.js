"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = __importDefault(require("express"));
class BaseRouter {
    constructor() {
        this.routesInitialized = false;
        this.getRoutes = () => {
            if (!this.routesInitialized) {
                this.initRoutes();
                this.routesInitialized = true;
            }
            return this.router;
        };
        this.router = express_1.default.Router();
    }
}
exports.BaseRouter = BaseRouter;
