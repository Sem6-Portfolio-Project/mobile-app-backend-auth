"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const base_router_1 = require("./base-router");
class AuthRouter extends base_router_1.BaseRouter {
    constructor(authController) {
        super();
        this.authController = authController;
        this.initRoutes = () => {
            this.router.post('/login', this.authController.login);
            this.router.post('/logout', this.authController.logout);
            this.router.post('/register', this.authController.signUp);
            this.router.post('/register', this.authController.confirmSignUp);
            this.router.post('/resend-code', this.authController.resendConfirmationCode);
            this.router.post("/forgot-password", this.authController.forgotPassword);
            this.router.post("/forgot-password-confirm", this.authController.confirmForgotPassword);
            this.router.post("/refresh-session", this.authController.refreshSession);
        };
    }
}
exports.AuthRouter = AuthRouter;
