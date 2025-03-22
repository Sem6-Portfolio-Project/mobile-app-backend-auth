import { Request, Response} from "express";
import { createLogger, CustomLogger } from "../helpers/lib/logger";
import { IUserInfo } from "../types/user";
import { AttributeType } from "@aws-sdk/client-cognito-identity-provider/dist-types/models/models_0.js";
import { USER_POOL_ATTRIBUTES } from "../constants";
import { CognitoService } from "../services/cognitoService";
import { pendingConfirmationResponse, failureResponse, successResponse } from "../helpers/lib/response";


const logger : CustomLogger = createLogger({ fileName: "AuthController"});

export class AuthController {

    constructor(
        private cognitoService: CognitoService,
    ) {}

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
    * @param req - contains (email, password, role)
    * @param res
    */
    signUp  = async (req: Request, res: Response) => {
        const {email, password} = req.body;
        logger.debug("Registering a new user with request body: %s",req.body);

        try {
            const userAttributes: AttributeType[] = this.getAttributes(req.body);

            const data = await this.cognitoService.signUp(
                email,
                password,
                userAttributes
            );

            if(!data.UserConfirmed) {
                logger.debug(
                        "User not confirmed.Confirmation code sent to %s",
                        data?.CodeDeliveryDetails?.Destination
                );

                return pendingConfirmationResponse({
                    res,
                    body: {
                        data: data,
                        message: "Please check your email for the confirmation code."
                    }

                });
            }

        } catch (e) {
            return failureResponse({
                res,
                body: {
                    message: "Error happened while user signup process."
                }
            })
        }
    }

    // TODO
    confirmSignUp = async (req: Request, res: Response) => {
        const { email, confirmationCode, userGroup } = req.body;

        logger.debug("Confirming user signup with req body: %s",req.body);

        try {
            const data = await this.cognitoService.signUpConfirmation(
                email,
                confirmationCode
            );
            logger.debug("Successfully confirmed user by confirmation code.");

            await this.cognitoService.addUserToGroup(email,userGroup);
            logger.debug("Successfully added to the user group : %s",userGroup);

            return successResponse({
                res,
                body: {
                    data: data,
                    message: "User successfully confirmed and added to the user group."
                }

            })
        } catch (e) {
            return failureResponse({
                res,
                body: {
                    message: "Error happened while signup confirmation process."
                }
            })
        }


    }

    // TODO
    resendConfirmationCode = async () => {}

    // TODO
    forgotPassword = async () => {}

    //TODO
    refreshSession = async () => {}

    getAttributes = (
        userInfo: IUserInfo
    ): AttributeType[] => {
        return [
            {Name: USER_POOL_ATTRIBUTES.EMAIL ,Value: userInfo.email},
            {Name: USER_POOL_ATTRIBUTES.USER_ROLE ,Value: userInfo.role},
            {Name: USER_POOL_ATTRIBUTES.USER_GROUP ,Value: userInfo.userGroup},
        ];
    };
}