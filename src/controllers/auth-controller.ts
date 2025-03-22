import { Request, Response} from "express";
import { createLogger, CustomLogger } from "../helpers/lib/logger";
import { IUserInfo } from "../types/user";


const logger : CustomLogger = createLogger({ fileName: "AuthController"});

export class AuthController {

    // TODO
    login= async (req: Request, res: Response) => {
        const { email, password} = req.body;

        try {
            logger.debug("User login attempt with email: %s ",email);

        } catch (e) {

        }




    }

    // TODO
    logout = async () => {}

    /**
    * signup a user
    * @param userInfo
    */
    signUp  = async (userInfo: IUserInfo) => {
        const {email, password, role, userGroup} = userInfo


    }

    // TODO
    confirmSignUp = async () => {}

    // TODO
    resendConfirmationCode = async () => {}

    // TODO
    forgotPassword = async () => {}

    //TODO
    refreshSession = async () => {}
}