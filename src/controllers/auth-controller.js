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
exports.AuthController = void 0;
const logger_1 = require("../helpers/lib/logger");
const constants_1 = require("../constants");
const response_1 = require("../helpers/lib/response");
const logger = (0, logger_1.createLogger)({ fileName: "AuthController" });
class AuthController {
    constructor(cognitoService) {
        this.cognitoService = cognitoService;
        /**
         * user login
         * @param req
         * @param res
         */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                logger.debug("User login attempt with email: %s ", email);
                const data = yield this.cognitoService.login(email, password);
                logger.debug("Successfully logged with email: %s ", email);
                (0, response_1.successResponse)({
                    res,
                    body: {
                        data: data,
                        message: "Successfully logged."
                    }
                });
            }
            catch (e) {
                (0, response_1.failureResponse)({
                    res,
                    body: {
                        message: "Error happened while logging."
                    }
                });
            }
        });
        /**
         * user log out
         * @param req
         * @param res
         */
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                yield this.cognitoService.logout(email);
                logger.debug("Successfully logged out from all devices.");
                (0, response_1.successResponse)({
                    res,
                    body: {
                        message: "Successfully logged out from all devices."
                    }
                });
            }
            catch (e) {
                (0, response_1.failureResponse)({
                    res,
                    body: {
                        message: "Error happened while logging out."
                    }
                });
            }
        });
        /**
        * signup a user
        * @param req - contains (email, password, role)
        * @param res
        */
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = req.body;
            logger.debug("Registering a new user with request body: %s", req.body);
            try {
                const userAttributes = this.getAttributes(req.body);
                const data = yield this.cognitoService.signUp(email, password, userAttributes);
                if (!data.UserConfirmed) {
                    logger.debug("User not confirmed.Confirmation code sent to %s", (_a = data === null || data === void 0 ? void 0 : data.CodeDeliveryDetails) === null || _a === void 0 ? void 0 : _a.Destination);
                    (0, response_1.pendingConfirmationResponse)({
                        res,
                        body: {
                            data: data,
                            message: "Please check your email for the confirmation code."
                        }
                    });
                }
                else if (data.UserConfirmed) {
                    (0, response_1.successResponse)({
                        res,
                        body: {
                            data: data,
                            message: "Successfully signup."
                        }
                    });
                }
            }
            catch (e) {
                (0, response_1.failureResponse)({
                    res,
                    body: {
                        message: "Error happened while user signup process."
                    }
                });
            }
        });
        /**
         * user confirmation by confirmation code
         * @param req
         * @param res
         */
        this.confirmSignUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, confirmationCode, userGroup } = req.body;
            logger.debug("Confirming user by confirmation code");
            try {
                const data = yield this.cognitoService.signUpConfirmation(email, confirmationCode);
                logger.debug("Successfully confirmed user by confirmation code.");
                yield this.cognitoService.addUserToGroup(email, userGroup);
                logger.debug("Successfully added to the user group : %s", userGroup);
                (0, response_1.successResponse)({
                    res,
                    body: {
                        data: data,
                        message: "User successfully confirmed and added to the user group."
                    }
                });
            }
            catch (e) {
                (0, response_1.failureResponse)({
                    res,
                    body: {
                        message: "Error happened while signup confirmation process."
                    }
                });
            }
        });
        /**
         * resending the confirmation code
         * @param req
         * @param res
         */
        this.resendConfirmationCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { email } = req.body;
            logger.debug("Sending the confirmation code.");
            try {
                const data = yield this.cognitoService.resendConfirmationCode(email);
                if ((_a = data === null || data === void 0 ? void 0 : data.CodeDeliveryDetails) === null || _a === void 0 ? void 0 : _a.Destination) {
                    logger.debug("Successfully sent the confirmation code to %s", (_b = data === null || data === void 0 ? void 0 : data.CodeDeliveryDetails) === null || _b === void 0 ? void 0 : _b.Destination);
                    (0, response_1.successResponse)({
                        res,
                        body: {
                            data: data.CodeDeliveryDetails,
                            message: "Successfully sent confirmation code."
                        }
                    });
                }
                else {
                    (0, response_1.failureResponse)({
                        res,
                        status: 400,
                        body: {
                            message: "Failed to send confirmation code. Please check the provided email."
                        }
                    });
                }
            }
            catch (e) {
                (0, response_1.failureResponse)({
                    res,
                    body: {
                        message: "Error happened while sending confirmation code."
                    }
                });
            }
        });
        /**
         * forgot password
         * @param req
         * @param res
         */
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email } = req.body;
            logger.debug("Sending the confirmation code for reset password.");
            try {
                const data = yield this.cognitoService.forgotPassword(email);
                if ((_a = data === null || data === void 0 ? void 0 : data.CodeDeliveryDetails) === null || _a === void 0 ? void 0 : _a.Destination) {
                    logger.debug("Successfully sent confirmation code to %s for reset password.", data.CodeDeliveryDetails.Destination);
                    (0, response_1.successResponse)({
                        res,
                        body: {
                            data: data.CodeDeliveryDetails,
                            message: "Successfully sent confirmation code for reset password."
                        }
                    });
                }
                else {
                    (0, response_1.failureResponse)({
                        res,
                        status: 400,
                        body: {
                            message: "Failed to send confirmation code. Please check the provided email."
                        }
                    });
                }
            }
            catch (e) {
                (0, response_1.failureResponse)({
                    res,
                    body: {
                        message: "Error happened while sending confirmation code for reset password."
                    }
                });
            }
        });
        /**
         * confirming forgot password
         * @param req
         * @param res
         */
        this.confirmForgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, confirmationCode, newPassword } = req.body;
            logger.debug("Confirming reset password.");
            try {
                yield this.cognitoService.confirmForgotPassword(email, confirmationCode, newPassword);
                logger.debug("Successfully reset the password.");
                (0, response_1.successResponse)({
                    res,
                    body: {
                        message: "Successfully reset the password"
                    }
                });
            }
            catch (e) {
                (0, response_1.failureResponse)({
                    res,
                    body: {
                        message: "Error happened while resetting password."
                    }
                });
            }
        });
        //TODO
        this.refreshSession = () => __awaiter(this, void 0, void 0, function* () { });
        this.getAttributes = (userInfo) => {
            return [
                { Name: constants_1.USER_POOL_ATTRIBUTES.EMAIL, Value: userInfo.email },
                { Name: constants_1.USER_POOL_ATTRIBUTES.USER_ROLE, Value: userInfo.role },
                { Name: constants_1.USER_POOL_ATTRIBUTES.USER_GROUP, Value: userInfo.userGroup },
            ];
        };
    }
}
exports.AuthController = AuthController;
