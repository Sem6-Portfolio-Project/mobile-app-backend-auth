import { BaseRouter } from "./base-router.js";
import { AuthController } from "../controllers/auth-controller.js";
import { injectable } from "tsyringe";

@injectable()
export class AuthRouter extends BaseRouter {

    constructor(
        private authController: AuthController
    ) {
        super();
    }

    protected initRoutes = (): void => {

        this.router.post('/login',this.authController.login);

        this.router.post('/logout',this.authController.logout);

        this.router.post('/signup',this.authController.signUp);

        this.router.post('/signup-confirm',this.authController.confirmSignUp);

        this.router.post('/resend-code',this.authController.resendConfirmationCode);

        this.router.post("/forgot-password", this.authController.forgotPassword);

        this.router.post("/forgot-password-confirm", this.authController.confirmForgotPassword);

        this.router.post("/refresh-session", this.authController.refreshSession);
    }
}