"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_POOL_ATTRIBUTES = exports.ERROR_MESSAGES = exports.POOL_ID = exports.CLIENT_ID = exports.BASE_URLS = void 0;
//TODO: add base urls
exports.BASE_URLS = [];
//TODO: add cognito client & pool ids
exports.CLIENT_ID = '';
exports.POOL_ID = '';
exports.ERROR_MESSAGES = {
    UNEXPECTED_PROCESSING_ERROR: 'Unexpected processing error'
};
exports.USER_POOL_ATTRIBUTES = Object.freeze({
    COGNITO_USER_NAME: "cognito:username",
    EMAIL: "email",
    USER_ROLE: "custom:role",
    USER_GROUP: "cognito:groups",
});
