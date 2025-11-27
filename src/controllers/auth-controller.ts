import { Request, Response } from "express";
import {
    createLogger,
    CustomLogger
} from "../helpers/lib/logger.js";
import { IUserInfo } from "../types/user.js";
import {
    AttributeType
} from "@aws-sdk/client-cognito-identity-provider/dist-types/models/models_0.js";
import { USER_POOL_ATTRIBUTES } from "../constants.js";
import { CognitoService } from "../services/cognitoService.js";
import {
    pendingConfirmationResponse,
    failureResponse,
    successResponse
} from "../helpers/lib/response.js";
import { injectable } from "tsyringe";


const logger : CustomLogger = createLogger({ fileName: "AuthController"});

@injectable()
export class AuthController {

    constructor(
        private cognitoService: CognitoService,
    ) {}

    /**
     * user login
     * @param req
     * @param res
     */
    login = async (req: Request, res: Response): Promise<void> => {
        const { email, password} = req.body;

        try {
            logger.debug("User login attempt with email: %s ",email);

            const data = await this.cognitoService.login(
                email,
                password
            );

            logger.debug("Successfully logged.results: %s ",JSON.stringify(data));
            if (data) {
                successResponse({
                    res,
                    body: {
                        data: data,
                        message: "Successfully logged."
                    }
                });
            } else {
                failureResponse({
                    res,
                    status: 400,
                    body: {
                        message: "Something went wrong.Please try again later."
                    }
                })
            }

        } catch (e) {
            failureResponse({
                res,
                body: {
                    message: "Error happened while logging."
                }
            });
        }
    }

    /**
     * user log out
     * @param req
     * @param res
     */
    logout = async (req: Request, res:Response): Promise<void> => {
        const { accessToken } = req.body;

        try {
            await this.cognitoService.logout(accessToken);
            logger.debug("Successfully logged out from all devices.");
            successResponse({
                res,
                body: {
                    message: "Successfully logged out from all devices."
                }
            });
        } catch (e) {
            logger.debug("logout error : %s",e);
            failureResponse({
                res,
                body: {
                    message: "Error happened while logging out."
                }
            });
        }
    }

    /**
    * signup a user
    * @param req - contains (email, password, role)
    * @param res
    */
    signUp  = async (req: Request, res: Response): Promise<void> => {
        const {email, password} = req.body;
        logger.debug("Registering a new user with request body: %s",req.body);

        try {
            logger.debug("before the create user attributes")
            const userAttributes: AttributeType[] = this.getAttributes(req.body);
            logger.debug("after the create user attributes, %s", JSON.stringify(userAttributes))
            const data = await this.cognitoService.signUp(
                email,
                password,
                userAttributes
            );
            logger.debug("after getting data ,%s",data)
            if(!data.UserConfirmed) {
                logger.debug(
                    "User not confirmed.Confirmation code sent to %s",
                    data?.CodeDeliveryDetails?.Destination
                );

                 pendingConfirmationResponse({
                    res,
                    body: {
                        data: data,
                        message: "Please check your email for the confirmation code."
                    }

                });
            } else if (data.UserConfirmed) {
                 successResponse({
                    res,
                    body: {
                        data: data,
                        message: "Successfully signup."
                    }
                });
            }
        } catch (e) {
            logger.debug("errror: %s",e)
             failureResponse({
                res,
                body: {
                    message: "Error happened while user signup process."
                }
            })
        }
    }

    /**
     * user confirmation by confirmation code
     * @param req
     * @param res
     */
    confirmSignUp = async (req: Request, res: Response): Promise<void> => {
        const { email, confirmationCode, userGroup } = req.body;

        logger.debug("Confirming user by confirmation code");

        try {
            const data = await this.cognitoService.signUpConfirmation(
                email,
                confirmationCode
            );
            logger.debug("Successfully confirmed user by confirmation code.");

            await this.cognitoService.addUserToGroup(email,userGroup);
            logger.debug("Successfully added to the user group : %s",userGroup);

            successResponse({
                res,
                body: {
                    data: data,
                    message: "User successfully confirmed and added to the user group."
                }

            })
        } catch (e) {
            failureResponse({
                res,
                body: {
                    message: "Error happened while signup confirmation process."
                }
            })
        }


    }

    /**
     * resending the confirmation code
     * @param req
     * @param res
     */
    resendConfirmationCode = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;

        logger.debug("Sending the confirmation code.");
        try {
            const data = await this.cognitoService.resendConfirmationCode(email);

            logger.debug("response data : %s",JSON.stringify(data))
            if (data?.CodeDeliveryDetails?.Destination) {
                logger.debug(
                    "Successfully sent the confirmation code to %s",data?.CodeDeliveryDetails?.Destination
                );
                successResponse({
                    res,
                    body: {
                        data: data.CodeDeliveryDetails,
                        message: "Successfully sent confirmation code."
                    }
                });
            } else {
                failureResponse({
                    res,
                    status: 400,
                    body: {
                        message: "Failed to send confirmation code. Please check the provided email."
                    }
                });
            }
        } catch (e) {
            logger.debug("error: %s",e);
            failureResponse({
                res,
                body: {
                    message: "Error happened while sending confirmation code."
                }
            });
        }

    }

    /**
     * forgot password
     * @param req
     * @param res
     */
    forgotPassword = async (req: Request, res: Response): Promise<void> => {
       const { email } = req.body;

       logger.debug("Sending the confirmation code for reset password.");

       try {
          const data= await this.cognitoService.forgotPassword(email);

          if (data?.CodeDeliveryDetails?.Destination) {
              logger.debug(
                  "Successfully sent confirmation code to %s for reset password."
                  ,data.CodeDeliveryDetails.Destination
              );

              successResponse({
                  res,
                  body: {
                      data: data.CodeDeliveryDetails,
                      message: "Successfully sent confirmation code for reset password."
                  }
              });
          } else {
              failureResponse({
                  res,
                  status: 400,
                  body: {
                      message: "Failed to send confirmation code. Please check the provided email."
                  }
              });
          }
       } catch (e) {
           failureResponse({
              res,
              body: {
                  message: "Error happened while sending confirmation code for reset password."
              }
           });
       }

    }

    /**
     * confirming forgot password
     * @param req
     * @param res
     */
    confirmForgotPassword = async (req: Request,res: Response): Promise<void> => {
        const { email, confirmationCode, newPassword } = req.body;

        logger.debug("Confirming reset password.");

        try {
            await this.cognitoService.confirmForgotPassword(
                email,
                confirmationCode,
                newPassword
            );
            logger.debug("Successfully reset the password.");
            successResponse({
                res,
                body: {
                    message: "Successfully reset the password"
                }
            });
        } catch (e) {
            failureResponse({
                res,
                body: {
                    message: "Error happened while resetting password."
                }
            });
        }


    }

    /**
     * refresh the session
     * @param req 
     * @param res 
     */
    refreshSession = async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.query.token as string;
        logger.debug('refreshing the session.')
        try {
            const data = await this.cognitoService.getTokensFromRefreshToken(refreshToken);
            if(data) {
                successResponse({
                    res,
                    body: {
                        data: data,
                        message: 'Successfully got the tokens'
                    }
                })
            } else {
                failureResponse({
                    res,
                    body: {
                        message: 'Not found tokens.'
                    }
                })
            }

        } catch (e) {
            logger.error('Error while getting the token from refresh tokens. error: %s', e);
            failureResponse({
                res,
                body: {
                    message: 'Error while getting the token from refresh tokens.'
                }
            })
        }
    }

    getAttributes = (
        userInfo: IUserInfo
    ): AttributeType[] => {
        return [
            {Name: USER_POOL_ATTRIBUTES.EMAIL ,Value: userInfo.email},
            // {Name: USER_POOL_ATTRIBUTES.USER_ROLE ,Value: userInfo.role},
            // {Name: USER_POOL_ATTRIBUTES.USER_GROUP ,Value: userInfo.userGroup},
        ];
    };
}