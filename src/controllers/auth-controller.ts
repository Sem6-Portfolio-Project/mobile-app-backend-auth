import { Request, Response} from "express";

export class AuthController {

    // TODO
    login= async (req: Request, res: Response) => {
        const { email, password} = req.body;



    }

    // TODO
    logout = async () => {}

    // TODO
    register = async () => {}

    // TODO
    confirmSignUp = async () => {}

    // TODO
    resendConfirmationCode = async () => {}

    // TODO
    forgotPassword = async () => {}

    //TODO
    refreshSession = async () => {}
}