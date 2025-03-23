"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoService = void 0;
const logger_1 = require("../helpers/lib/logger");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const awsService_1 = require("./awsService");
const constants_1 = require("../constants");
const logger = (0, logger_1.createLogger)({ fileName: "CognitoService" });
class CognitoService extends awsService_1.AwsService {
    constructor() {
        super("Cognito", new client_cognito_identity_provider_1.CognitoIdentityProviderClient({}));
        /**
         * User signup
         * @param username username of the user
         * @param password password
         * @param userAttributes user attributes
         */
        this.signUp = (username, password, userAttributes) => {
            return this.executeCommand(new client_cognito_identity_provider_1.SignUpCommand({
                ClientId: constants_1.CLIENT_ID,
                Username: username,
                Password: password,
                UserAttributes: userAttributes
            }), "SignUpCommand");
        };
        /**
         * User signup confirmation
         * @param username
         * @param confirmationCode
         */
        this.signUpConfirmation = (username, confirmationCode) => {
            return this.executeCommand(new client_cognito_identity_provider_1.ConfirmSignUpCommand({
                ClientId: constants_1.CLIENT_ID,
                Username: username,
                ConfirmationCode: confirmationCode
            }), "ConfirmSignUpCommand");
        };
        /**
         * Resend confirmation code
         * @param username
         */
        this.resendConfirmationCode = (username) => {
            return this.executeCommand(new client_cognito_identity_provider_1.ResendConfirmationCodeCommand({
                ClientId: constants_1.CLIENT_ID,
                Username: username
            }), "ResendConfirmationCodeCommand");
        };
        /**
         * forgot password.This will send the confirmation code to the end user when invoke this function.
         * @param username
         */
        this.forgotPassword = (username) => {
            return this.executeCommand(new client_cognito_identity_provider_1.ForgotPasswordCommand({
                ClientId: constants_1.CLIENT_ID,
                Username: username
            }), "ForgotPasswordCommand");
        };
        /**
         * confirm forgot password
         * @param username
         * @param confirmationCode
         * @param newPassword
         */
        this.confirmForgotPassword = (username, confirmationCode, newPassword) => {
            return this.executeCommand(new client_cognito_identity_provider_1.ConfirmForgotPasswordCommand({
                ClientId: constants_1.CLIENT_ID,
                ConfirmationCode: confirmationCode,
                Username: username,
                Password: newPassword
            }), "ConfirmForgotPasswordCommand");
        };
        /**
         * add user to user group
         * @param username
         * @param groupName
         */
        this.addUserToGroup = (username, groupName) => {
            return this.executeCommand(new client_cognito_identity_provider_1.AdminAddUserToGroupCommand({
                UserPoolId: constants_1.POOL_ID,
                Username: username,
                GroupName: groupName
            }), "AdminAddUserToGroupCommand");
        };
        /**
         * user login
         * @param username
         * @param password
         */
        this.login = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const response = this.executeCommand(new client_cognito_identity_provider_1.InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: constants_1.CLIENT_ID,
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password,
                }
            }), "InitiateAuthCommand");
            const { ChallengeName, AuthenticationResult } = response;
            if (ChallengeName) {
                logger.debug('ChallengeName: %s', ChallengeName);
                //TODO: if need in future, implement this
            }
            return AuthenticationResult;
        });
        this.logout = (username) => __awaiter(this, void 0, void 0, function* () {
            return this.executeCommand(new client_cognito_identity_provider_1.AdminUserGlobalSignOutCommand({
                UserPoolId: constants_1.POOL_ID,
                Username: username
            }), "AdminUserGlobalSignOutCommand");
        });
    }
}
exports.CognitoService = CognitoService;
