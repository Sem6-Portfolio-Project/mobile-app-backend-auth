
import {
    AttributeType
} from '@aws-sdk/client-cognito-identity-provider/dist-types/models/models_0.js'
import { createLogger, CustomLogger } from "../helpers/lib/logger";
import {
    CognitoIdentityProviderClient,
    ConfirmForgotPasswordCommand,
    ConfirmForgotPasswordCommandOutput,
    ConfirmSignUpCommand,
    ConfirmSignUpCommandOutput,
    ForgotPasswordCommand,
    ForgotPasswordCommandOutput,
    InitiateAuthCommand,
    ResendConfirmationCodeCommand,
    ResendConfirmationCodeCommandOutput,
    SignUpCommand,
    SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { AwsService } from "./awsService";
import { CLIENT_ID } from "../constants";
import {
    AuthenticationResultType
} from "@aws-sdk/client-cognito-identity-provider/dist-types/models";

const logger: CustomLogger = createLogger({ fileName: "CognitoService" });

export class CognitoService extends AwsService{

    constructor() {
        super("Cognito", new CognitoIdentityProviderClient({}));
    }

    /**
     * User signup
     * @param username username of the user
     * @param password password
     * @param userAttributes user attributes
     */
    signUp = (
        username: string,
        password: string,
        userAttributes: AttributeType[],
    ): Promise<SignUpCommandOutput> => {
        return this.executeCommand(
            new SignUpCommand({
                ClientId: CLIENT_ID,
                Username: username,
                Password: password,
                UserAttributes: userAttributes
            }),
            "SignUpCommand"
        );
    };

    /**
     * User signup confirmation
     * @param username
     * @param confirmationCode
     */
    signUpConfirmation=(
        username: string,
        confirmationCode: string
    ): Promise<ConfirmSignUpCommandOutput> => {
        return this.executeCommand(
            new ConfirmSignUpCommand({
                ClientId: CLIENT_ID,
                Username: username,
                ConfirmationCode: confirmationCode
            }),
            "ConfirmSignUpCommand"
        );
    };

    /**
     * Resend confirmation code
     * @param username
     */
    resendConfirmationCode = (
        username: string
    ): Promise<ResendConfirmationCodeCommandOutput> => {
        return this.executeCommand(
            new ResendConfirmationCodeCommand({
                ClientId: CLIENT_ID,
                Username: username
            }),
            "ResendConfirmationCodeCommand"
        );
    };

    /**
     * forgot password.This will send the confirmation code to the end user when invoke this function.
     * @param username
     */
    forgotPassword = (
        username: string
    ): Promise<ForgotPasswordCommandOutput> => {
        return this.executeCommand(
            new ForgotPasswordCommand({
                ClientId: CLIENT_ID,
                Username: username
            }),
            "ForgotPasswordCommand"
        );
    };


    /**
     * confirm forgot password
     * @param username
     * @param confirmationCode
     * @param newPassword
     */
    confirmForgotPassword = (
        username: string,
        confirmationCode: string,
        newPassword: string
    ): Promise<ConfirmForgotPasswordCommandOutput> => {
        return this.executeCommand(
            new ConfirmForgotPasswordCommand({
                ClientId: CLIENT_ID,
                ConfirmationCode: confirmationCode,
                Username: username,
                Password: newPassword
            }),
            "ConfirmForgotPasswordCommand"
        );
    };

    /**
     * user login
     * @param username
     * @param password
     */
    login = async(
        username: string,
        password: string,
    ): Promise<AuthenticationResultType> => {
        const response =  this.executeCommand(
             new InitiateAuthCommand({
                 AuthFlow: "USER_PASSWORD_AUTH",
                 ClientId: CLIENT_ID,
                 AuthParameters: {
                     USERNAME: username,
                     PASSWORD: password,
                 }
             }),
            "InitiateAuthCommand"
        );
        const {ChallengeName, AuthenticationResult} = response;
        if(ChallengeName) {
            logger.debug('ChallengeName: %s',ChallengeName);
            //TODO: if need in future, implement this
        }

        return AuthenticationResult;
    };
}