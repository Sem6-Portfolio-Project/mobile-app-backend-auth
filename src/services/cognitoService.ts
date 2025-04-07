
import {
    AttributeType
} from '@aws-sdk/client-cognito-identity-provider/dist-types/models/models_0.js'
import { createLogger, CustomLogger } from "../helpers/lib/logger.js";
import {
    AdminAddUserToGroupCommand,
    AdminAddUserToGroupCommandOutput,
    AdminUserGlobalSignOutCommandOutput,
    CognitoIdentityProviderClient,
    ConfirmForgotPasswordCommand,
    ConfirmForgotPasswordCommandOutput,
    ConfirmSignUpCommand,
    ConfirmSignUpCommandOutput,
    ForgotPasswordCommand,
    ForgotPasswordCommandOutput, GlobalSignOutCommand,
    InitiateAuthCommand,
    ResendConfirmationCodeCommand,
    ResendConfirmationCodeCommandOutput,
    SignUpCommand,
    SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { AwsService } from "./awsService.js";
import { CLIENT_ID,POOL_ID } from "../constants.js";
import { AuthenticationResultType } from "aws-sdk/clients/cognitoidentityserviceprovider.js";


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
        userAttributes?: AttributeType[],
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
     * add user to user group
     * @param username
     * @param groupName
     */
    addUserToGroup = (
        username: string,
        groupName: string
    ): Promise<AdminAddUserToGroupCommandOutput> => {
        return this.executeCommand(
            new AdminAddUserToGroupCommand({
                UserPoolId: POOL_ID,
                Username: username,
                GroupName: groupName
            }),
            "AdminAddUserToGroupCommand"
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
        const response = await this.executeCommand(
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

    logout = async (
        accessToken: string
    ): Promise<AdminUserGlobalSignOutCommandOutput> => {
        return this.executeCommand(
            new GlobalSignOutCommand({
                AccessToken: accessToken
            }),
            "GlobalSignOutCommand"
        );
    }
}