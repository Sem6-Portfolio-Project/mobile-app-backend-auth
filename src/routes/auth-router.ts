import { BaseRouter } from "./base-router";
import { AuthController } from "../controllers/auth-controller";


export class AuthRouter extends BaseRouter {

    constructor(
        private authController: AuthController
    ) {
        super();
    }

    protected initRoutes = (): void => {

        this.router.post('/login',this.authController.login);

        this.router.post('/logout',this.authController.logout);

        this.router.post('/register',this.authController.signUp);

        this.router.post('/register',this.authController.confirmSignUp);

        this.router.post('/resend-code',this.authController.resendConfirmationCode);

        this.router.post("/forgot-password", this.authController.forgotPassword);

        this.router.post("/forgot-password-confirm", this.authController.confirmForgotPassword);

        this.router.post("/refresh-session", this.authController.refreshSession);
    }
}